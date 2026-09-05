import json

import pytest

from server import COMMANDS, RELAYED_MESSAGES, Clients, translate


def bus_message(msg_type, data=None):
    return json.dumps({"type": msg_type, "data": data or {}})


class TestTranslate:
    def test_track_info_relays(self):
        raw = bus_message("ovos.common_play.track_info", {"title": "Sono"})
        assert translate(raw) == ("track_info", {"title": "Sono"})

    def test_playback_time_relays(self):
        raw = bus_message("ovos.common_play.playback_time", {"position": 12})
        assert translate(raw) == ("playback_time", {"position": 12})

    def test_gui_value_set_unwraps_media(self):
        raw = bus_message("gui.value.set", {"media": {"artist": "Ahmad Jamal"}})
        assert translate(raw) == ("media_info", {"artist": "Ahmad Jamal"})

    def test_gui_value_set_without_media_is_ignored(self):
        assert translate(bus_message("gui.value.set", {"other": 1})) is None

    def test_unrelated_message_is_ignored(self):
        assert translate(bus_message("mycroft.ready")) is None

    def test_bytes_are_decoded(self):
        raw = bus_message("ovos.common_play.track_info", {"title": "Sono"})
        assert translate(raw.encode("utf8")) == ("track_info", {"title": "Sono"})

    def test_malformed_json_returns_none(self):
        assert translate("not json") is None

    def test_missing_data_key_does_not_raise(self):
        assert translate(json.dumps({"type": "gui.value.set"})) is None


class TestCommands:
    def test_every_button_maps_to_a_bus_message(self):
        # The five buttons in public/index.html. A missing entry here means a
        # dead button in the UI.
        assert set(COMMANDS) == {"play", "pause", "stop", "next", "prev"}

    def test_command_targets_are_audio_service_messages(self):
        assert all(t.startswith("mycroft.audio.service.") for t in COMMANDS.values())


class FakeSocket:
    def __init__(self, fail=False):
        self.sent = []
        self.fail = fail

    async def send_text(self, payload):
        if self.fail:
            raise RuntimeError("client went away")
        self.sent.append(payload)


class TestBroadcast:
    async def test_sends_to_every_client(self):
        clients = Clients()
        a, b = FakeSocket(), FakeSocket()
        clients.add(a)
        clients.add(b)

        await clients.broadcast("track_info", {"title": "Sono"})

        expected = json.dumps({"event": "track_info", "data": {"title": "Sono"}})
        assert a.sent == [expected]
        assert b.sent == [expected]

    async def test_drops_clients_that_fail(self):
        clients = Clients()
        good, bad = FakeSocket(), FakeSocket(fail=True)
        clients.add(good)
        clients.add(bad)

        await clients.broadcast("track_info", {})
        await clients.broadcast("track_info", {})

        # The failing client is discarded after the first attempt, so the
        # second broadcast does not raise.
        assert len(good.sent) == 2


class TestRelayTable:
    def test_relayed_messages_cover_the_ocp_topics(self):
        assert RELAYED_MESSAGES == {
            "ovos.common_play.track_info": "track_info",
            "ovos.common_play.playback_time": "playback_time",
        }
