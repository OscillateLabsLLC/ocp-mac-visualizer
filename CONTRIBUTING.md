# Contributing to OVOS Music Visualizer

Thanks for your interest in contributing.

## Prerequisites

- Python 3.10 or newer
- [uv](https://docs.astral.sh/uv/)
- A running OpenVoiceOS instance to test against

## Setup

1. Fork and clone the repository:

   ```sh
   git clone https://github.com/<your-username>/ocp-mac-visualizer.git
   cd ocp-mac-visualizer
   ```

2. Install the dependencies:

   ```sh
   uv sync --all-extras
   ```

3. Run the server:

   ```sh
   uv run python server.py
   ```

## Project structure

```
├── server.py           # OVOS bus <-> browser WebSocket bridge
├── public/             # Static frontend served at /
│   ├── index.html
│   ├── app.js          # Native WebSocket client
│   └── styles.css
├── test/
│   └── test_server.py
└── pyproject.toml
```

## Tests

```sh
uv run pytest
```

The tests cover message translation, the command table, and broadcast
behavior. They do not need a running OVOS instance.

## Commits

This project uses [conventional commits](https://www.conventionalcommits.org/)
and [release-please](https://github.com/googleapis/release-please). Your commit
messages drive the changelog and the version bump, so use `fix:`, `feat:`, and
`feat!:`/`BREAKING CHANGE:` accordingly.

## Pull requests

Open pull requests against `main`. CI runs the test suite on Python 3.10
through 3.13.
