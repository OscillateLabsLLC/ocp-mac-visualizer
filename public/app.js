const socket = io();

let currentTime = 0;
let totalDuration = 0;

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("media_info", (data) => {
  console.log("Received media info:", data);
  updateTrackInfo(data);
});

socket.on("playback_time", (data) => {
  console.log("Received playback time:", data);
  if (data && typeof data.position === "number") {
    currentTime = data.position;
    totalDuration = data.length / 1000 || totalDuration / 1000;
    updateProgressBar();
  }
});

function updateTrackInfo(data) {
  document.getElementById("title").textContent =
    data.title || data.track || "Unknown Title";
  document.getElementById("artist").textContent =
    data.artist || "Unknown Artist";
  document.getElementById("album").textContent = data.album || "Unknown Album";
  document.getElementById("album-art").src = data.image || "";

  // Update totalDuration only if it's different
  totalDuration = (data.length || data.duration) / 1000;
  updateTimeDisplay();
}

function updateProgressBar() {
  if (totalDuration > 0) {
    const progressPercentage = (currentTime / totalDuration) * 100;
    document.getElementById(
      "progress-bar"
    ).style.width = `${progressPercentage}%`;
  } else {
    document.getElementById("progress-bar").style.width = "0%";
  }
}

function formatTime(seconds) {
  seconds = Math.floor(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
}

function updateTimeDisplay() {
  document.getElementById("current-time").textContent = formatTime(currentTime);
  document.getElementById("total-time").textContent = formatTime(totalDuration);
}

document.getElementById("play-button").addEventListener("click", () => {
  socket.emit("command", { command: "play" });
});
document.getElementById("pause-button").addEventListener("click", () => {
  socket.emit("command", { command: "pause" });
  document.getElementById("stop-button").addEventListener("click", () => {
    socket.emit("command", { command: "stop" });
  });
  document.getElementById("prev-button").addEventListener("click", () => {
    socket.emit("command", { command: "prev" });
  });
  document.getElementById("next-button").addEventListener("click", () => {
    socket.emit("command", { command: "next" });
  });
});
