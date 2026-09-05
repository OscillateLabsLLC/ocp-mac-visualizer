# Changelog

## [1.0.0](https://github.com/OscillateLabsLLC/ocp-mac-visualizer/compare/v0.0.4...v1.0.0) (2026-09-05)


### ⚠ BREAKING CHANGES

* the server now runs with `uv run python server.py` instead of `node server.js`, and requires Python 3.10+ instead of Node.

### Features

* rewrite the server in Python and drop the npm toolchain ([a8ad843](https://github.com/OscillateLabsLLC/ocp-mac-visualizer/commit/a8ad8434e6657ea74b038b0700be2cc77bc81dff))


### Bug Fixes

* **security:** validate album art URLs before assigning to img.src ([5514f93](https://github.com/OscillateLabsLLC/ocp-mac-visualizer/commit/5514f9357fe614a2857ef45715c898a578c497c5))
* support wss, make bus URL and port configurable, restore CONTRIBUTING sections ([0c6d440](https://github.com/OscillateLabsLLC/ocp-mac-visualizer/commit/0c6d4402d6697cebb39f95bb16f86b7ffe9c4d06))
