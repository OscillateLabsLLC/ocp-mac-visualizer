const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const WebSocket = require("ws");
const net = require("net");
const fs = require("fs");
const path = require("path");

const port = 3000;

app.use(express.static("public"));

const ovosSocket = new WebSocket("ws://localhost:8181/core");
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

// Function to find the most recent MPV socket file
function findMpvSocket() {
  const tmpDir = "/private/tmp";
  const files = fs.readdirSync(tmpDir);
  const mpvSockets = files
    .filter((file) => /^mpv\d+$/.test(file))
    .map((file) => ({
      name: file,
      path: path.join(tmpDir, file),
      ctime: fs.statSync(path.join(tmpDir, file)).ctime,
    }))
    .sort((a, b) => b.ctime - a.ctime);

  return mpvSockets.length > 0 ? mpvSockets[0].path : null;
}

// Function to connect to MPV socket
function connectToMpvSocket() {
  const socketPath = findMpvSocket();

  if (!socketPath) {
    console.log("MPV socket not found. Waiting for it to appear...");
    setTimeout(connectToMpvSocket, 5000);
    return;
  }

  console.log(`Connecting to MPV socket: ${socketPath}`);
  const mpvSocket = net.createConnection(socketPath);

  mpvSocket.on("connect", () => {
    console.log("Connected to MPV socket");

    // Request playback time and volume updates
    setInterval(() => {
      mpvSocket.write('{ "command": ["get_property", "time-pos"] }\n');
      mpvSocket.write('{ "command": ["get_property", "volume"] }\n');
    }, 100);
  });

  mpvSocket.on("data", (data) => {
    try {
      const messages = data.toString().trim().split("\n");
      messages.forEach((msg) => {
        const message = JSON.parse(msg);
        if (message.event === "property-change") {
          if (message.name === "time-pos") {
            io.emit("playback_time", message.data);
          } else if (message.name === "volume") {
            io.emit("volume", message.data);
          }
        }
      });
    } catch (error) {
      console.error("Error parsing MPV data:", error);
    }
  });

  mpvSocket.on("error", (error) => {
    console.error("MPV socket error:", error);
    setTimeout(connectToMpvSocket, 5000); // Try to reconnect after 5 seconds
  });

  mpvSocket.on("close", () => {
    console.log("MPV socket closed, attempting to reconnect...");
    setTimeout(connectToMpvSocket, 5000); // Try to reconnect after 5 seconds
  });
}

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("command", (data) => {
    console.log("Received command:", data);
    sendCommandToMPV(data.command);
  });
});

function sendCommandToMPV(command) {
  const socketPath = findMpvSocket();
  if (!socketPath) {
    console.log("MPV socket not found");
    return;
  }

  const mpvSocket = net.createConnection(socketPath);

  mpvSocket.on("connect", () => {
    console.log("Connected to MPV socket for command");
    if (command === "play_pause") {
      mpvSocket.write('{ "command": ["cycle", "pause"] }\n');
    }
    mpvSocket.end();
  });

  mpvSocket.on("error", (error) => {
    console.error("Error sending command to MPV:", error);
  });
}

// Initial connection attempt
connectToMpvSocket();

http.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
