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

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Run `uv run pytest` to make sure the suite passes
4. Test manually against a running OVOS instance
5. Commit with conventional commit messages
6. Push to your fork
7. Open a pull request against `main`

**PR guidelines:**

- Keep PRs focused on a single concern
- Include tests for new functionality
- Update documentation as needed
- Make sure CI checks pass
- Link related issues

CI runs the test suite on Python 3.10 through 3.14.

## Configuration

Both settings are read from the environment, so you do not need to edit the
source to point the bridge somewhere else.

### OVOS bus connection

Defaults to `ws://127.0.0.1:8181/core`. Use `wss://` for a TLS-terminated
instance:

```bash
OVOS_BUS_URL="wss://ovos.example.com/core" uv run python server.py
```

### Server host and port

Defaults to `127.0.0.1:3000`:

```bash
HOST=0.0.0.0 PORT=8080 uv run python server.py
```

## Testing with OVOS

1. Make sure your OVOS instance is running
2. Start the visualizer
3. Play music through OVOS
4. Check that the visualizer updates correctly
5. Test the playback controls

## Questions?

- Open an issue for bugs or feature requests
- Join the [OpenVoiceOS Matrix chat](https://matrix.to/#/!XFpdtmgyCoPDxOMPpH:matrix.org?via=matrix.org)
- Check existing issues before creating new ones

## Code of Conduct

Be respectful and constructive. We're building tools for the OpenVoiceOS
community - professionalism and clear communication are essential.

## License

By contributing, you agree that your contributions will be licensed under the
Apache 2.0 License.
