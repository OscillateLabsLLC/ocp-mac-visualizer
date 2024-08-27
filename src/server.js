const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const WebSocket = require("ws");
const net = require("net");
const port = 3000;

app.use(express.static("public"));

const ovosSocket = new WebSocket("ws://127.0.0.1:8181/core");
const DEBUG = false;

ovosSocket.on("open", () => {
  console.log("Connected to OVOS websocket");
});

ovosSocket.on("message", (data) => {
  let messageString;
  if (data instanceof Buffer) {
    messageString = data.toString("utf8");
  } else {
    messageString = data;
  }

  if (DEBUG) {
    console.log("Received message from OVOS websocket:", messageString);
  }

  try {
    const message = JSON.parse(messageString);
    if (message.type === "ovos.common_play.track_info") {
      if (DEBUG) {
        console.log("Emitting track info:", message.data);
      }
      io.emit("track_info", message.data);
    } else if (message.type === "ovos.common_play.playback_time") {
      if (DEBUG) {
        console.log("Emitting playback time:", message.data);
      }
      io.emit("playback_time", message.data);
    } else if (
      message.type === "gui.value.set" &&
      message.data &&
      message.data.media
    ) {
      if (DEBUG) {
        console.log("Emitting media info:", message.data.media);
      }
      io.emit("media_info", message.data.media);
    }
  } catch (error) {
    console.error("Error parsing OVOS websocket message:", error);
  }
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("command", (data) => {
    console.log("Received command:", data);
    switch (data.command) {
      case "play":
        ovosSocket.send(
          JSON.stringify({
            type: "mycroft.audio.service.resume",
            data: {},
            context: { session: {} },
          })
        );
        break;
      case "pause":
        ovosSocket.send(
          JSON.stringify({
            type: "mycroft.audio.service.pause",
            data: {},
            context: { session: {} },
          })
        );
        break;
      case "stop":
        ovosSocket.send(
          JSON.stringify({
            type: "mycroft.audio.service.stop",
            data: {},
            context: { session: {} },
          })
        );
        break;
      case "next":
        ovosSocket.send(
          JSON.stringify({
            type: "mycroft.audio.service.next",
            data: {},
            context: { session: {} },
          })
        );
        break;
      case "prev":
        ovosSocket.send(
          JSON.stringify({
            type: "mycroft.audio.service.prev",
            data: {},
            context: { session: {} },
          })
        );
        break;
      default:
        console.log("Unknown command:", data.command);
    }
  });
});

http.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
