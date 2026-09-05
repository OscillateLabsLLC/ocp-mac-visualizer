const socket = new WebSocket(`ws://${location.host}/ws`);

let currentTime = 0;
let totalDuration = 0;

socket.addEventListener("open", () => {
  console.log("Connected to server");
});

socket.addEventListener("message", (event) => {
  const { event: name, data } = JSON.parse(event.data);
  if (name === "media_info" || name === "track_info") {
    updateTrackInfo(data);
  } else if (name === "playback_time") {
    updatePlaybackTime(data);
  }
});

function updatePlaybackTime(data) {
  if (data && typeof data.position === "number") {
    currentTime = data.position;
    totalDuration = data.length / 1000 || totalDuration / 1000;
    updateProgressBar();
  }
}

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

function send(command) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ command }));
  }
}

for (const command of ["play", "pause", "stop", "prev", "next"]) {
  document
    .getElementById(`${command}-button`)
    .addEventListener("click", () => send(command));
}
