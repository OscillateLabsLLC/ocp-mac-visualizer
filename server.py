"""Bridge the OVOS message bus to browser clients over a WebSocket.

Replaces the previous Express/socket.io implementation. The browser talks
plain WebSocket to /ws; this process talks to the OVOS bus and relays
messages in both directions.
"""

import asyncio
import json
import logging
from contextlib import asynccontextmanager
from pathlib import Path

import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles

LOG = logging.getLogger("ocp-mac-visualizer")

OVOS_BUS_URL = "ws://127.0.0.1:8181/core"
PORT = 3000
PUBLIC_DIR = Path(__file__).parent / "public"

# OVOS bus message type -> the event name the browser listens for.
RELAYED_MESSAGES = {
    "ovos.common_play.track_info": "track_info",
    "ovos.common_play.playback_time": "playback_time",
}

# Browser command -> the OVOS bus message type it sends.
COMMANDS = {
    "play": "mycroft.audio.service.resume",
    "pause": "mycroft.audio.service.pause",
    "stop": "mycroft.audio.service.stop",
    "next": "mycroft.audio.service.next",
    "prev": "mycroft.audio.service.prev",
}


class Clients:
    """The set of connected browsers, and the bus socket they share."""

    def __init__(self):
        self._browsers: set[WebSocket] = set()
        self.bus: websockets.WebSocketClientProtocol | None = None

    def add(self, ws: WebSocket) -> None:
        self._browsers.add(ws)

    def discard(self, ws: WebSocket) -> None:
        self._browsers.discard(ws)

    async def broadcast(self, event: str, data: dict) -> None:
        """Send one event to every browser, dropping any that have gone away."""
        payload = json.dumps({"event": event, "data": data})
        for ws in list(self._browsers):
            try:
                await ws.send_text(payload)
            except (WebSocketDisconnect, RuntimeError):
                self._browsers.discard(ws)


clients = Clients()


def translate(raw: str | bytes) -> tuple[str, dict] | None:
    """Map one raw OVOS bus message to a (event, data) pair for the browser."""
    if isinstance(raw, bytes):
        raw = raw.decode("utf8")
    try:
        message = json.loads(raw)
    except json.JSONDecodeError:
        LOG.exception("Cannot parse OVOS websocket message")
        return None

    msg_type = message.get("type")
    data = message.get("data") or {}

    if msg_type in RELAYED_MESSAGES:
        return RELAYED_MESSAGES[msg_type], data
    if msg_type == "gui.value.set" and data.get("media"):
        return "media_info", data["media"]
    return None


async def pump_bus() -> None:
    """Keep a connection to the OVOS bus and relay what it sends."""
    while True:
        try:
            async with websockets.connect(OVOS_BUS_URL) as bus:
                clients.bus = bus
                LOG.info("Connected to OVOS websocket")
                async for raw in bus:
                    translated = translate(raw)
                    if translated:
                        await clients.broadcast(*translated)
        except (OSError, websockets.WebSocketException) as err:
            LOG.warning("OVOS bus connection lost (%s); retrying in 5s", err)
        finally:
            clients.bus = None
        await asyncio.sleep(5)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    task = asyncio.create_task(pump_bus())
    yield
    task.cancel()


app = FastAPI(lifespan=lifespan)


@app.websocket("/ws")
async def browser_socket(ws: WebSocket) -> None:
    await ws.accept()
    clients.add(ws)
    LOG.info("Client connected")
    try:
        while True:
            command = json.loads(await ws.receive_text()).get("command")
            msg_type = COMMANDS.get(command)
            if not msg_type:
                LOG.info("Unknown command: %s", command)
                continue
            if clients.bus is None:
                LOG.warning("Dropping %s: no OVOS bus connection", command)
                continue
            await clients.bus.send(
                json.dumps({"type": msg_type, "data": {}, "context": {"session": {}}})
            )
    except WebSocketDisconnect:
        LOG.info("Client disconnected")
    finally:
        clients.discard(ws)


app.mount("/", StaticFiles(directory=PUBLIC_DIR, html=True), name="public")


def main() -> None:
    import uvicorn

    logging.basicConfig(level=logging.INFO)
    uvicorn.run(app, host="127.0.0.1", port=PORT)


if __name__ == "__main__":
    main()
