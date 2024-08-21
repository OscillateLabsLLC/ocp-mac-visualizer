# OVOS Music Visualizer

This project is a web-based music visualizer for OpenVoiceOS (OVOS), specifically [ovos-mac](https://github.com/OscillateLabsLLC/ovos-mac). It displays the currently playing track information, album art, and a simple visualization, along with playback controls.

## Features

- Displays current track information (title, artist, album)
- Shows album art
- Provides a play/pause button
- Displays a progress bar and current/total time
- Includes a simple audio visualization

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have a running instance of OpenVoiceOS
- Node.js and npm are installed on your system
- You have basic knowledge of terminal/command line operations

## Setting up OVOS Music Visualizer

To set up OVOS Music Visualizer, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/OscillateLabsLLC/ovos-music-visualizer.git
   cd ovos-music-visualizer
   ```

2. Install the dependencies:
   `npm install`
3. Configure the server:

- Open `server.js` and ensure the WebSocket URL is correct for your OVOS instance (this default is OVOS' default):

  ```javascript
  const ovosSocket = new WebSocket("ws://localhost:8181/core");
  ```

- If your OVOS instance is running on a different IP or port, update this URL accordingly.

4. Start the server:

   ```sh
   node server.js
   ```

5. Open a web browser and navigate to `http://localhost:3000` (or the appropriate address if you've configured a different port).

## Usage

Once the visualizer is running:

1. Start playing music on your OVOS device.
2. The visualizer should automatically update with the current track information.
3. Use the play/pause button to control playback.
4. The progress bar and time display will update as the track plays.

## Troubleshooting

If you encounter issues:

- Ensure your OVOS instance is running and accessible.
- Check that the WebSocket URL in `server.js` is correct.
- Look at the server console and browser console for any error messages.

## Contributing

Contributions to the OVOS Music Visualizer are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the [Apache 2.0 license](LICENSE).

## Acknowledgements

- OpenVoiceOS team for the amazing open-source voice assistant platform.
- All contributors and users of this project.
- Claude.AI for doing almost all the work on this project. I'm not much of a frontend developer, so I appreciate the help!
