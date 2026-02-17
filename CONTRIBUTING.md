# Contributing to OCP MAC Visualizer

Thanks for your interest in contributing! This document provides guidelines for contributing to the OVOS Music Visualizer.

## Development Setup

### Prerequisites

- Node.js 20+ and pnpm
- OpenVoiceOS instance running (for testing)
- Git

### Getting Started

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/OscillateLabsLLC/ocp-mac-visualizer
   cd ocp-mac-visualizer
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm run build
   node lib/server.js
   ```

   The visualizer will be available at `http://localhost:3000`.

## Project Structure

```text
ocp-mac-visualizer/
├── src/               # Source code
│   └── server.ts     # Express server with Socket.IO
├── public/           # Static frontend assets
│   ├── index.html    # Main HTML page
│   ├── style.css     # Styling
│   └── script.js     # Client-side JavaScript
├── test/             # Test files
├── .projenrc.js      # Projen configuration
└── package.json      # Dependencies and scripts
```

## Making Changes

### Using Projen

This project uses [Projen](https://projen.io/) for project configuration management. **Important:** Do not manually edit `package.json` or workflow files.

To modify project configuration:

1. Edit `.projenrc.js`
2. Run `pnpm projen` to regenerate files

### Code Style

- Follow TypeScript/JavaScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and concise

### Testing

The project is currently configured with Jest but tests have not yet been implemented. This is a great area for contribution!

```bash
# Run tests (when implemented)
pnpm test
```

### Development Workflow

```bash
# Compile TypeScript
pnpm compile

# Build project
pnpm build

# Run tests
pnpm test

# Update dependencies
pnpm upgrade
```

## Commits

Use clear, descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add volume control to visualizer
fix: resolve WebSocket reconnection issue
docs: update setup instructions
test: add tests for playback controls
chore: update dependencies
```

**Common prefixes:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

## Pull Requests

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Run `pnpm build` to ensure it compiles
4. Test manually with a running OVOS instance
5. Commit with conventional commit messages
6. Push to your fork
7. Open a pull request

**PR Guidelines:**
- Keep PRs focused on a single concern
- Include tests for new functionality
- Update documentation as needed
- Ensure CI checks pass
- Link related issues

## Configuration

### WebSocket Connection

The visualizer connects to OVOS via WebSocket. Configure the connection in `src/server.ts`:

```typescript
const ovosSocket = new WebSocket("ws://localhost:8181/core");
```

Update the URL if your OVOS instance runs on a different host/port.

### Server Port

The default port is 3000. Change it by setting the `PORT` environment variable:

```bash
PORT=8080 node lib/server.js
```

## Testing with OVOS

1. Ensure your OVOS instance is running
2. Start the visualizer
3. Play music through OVOS
4. Verify the visualizer updates correctly
5. Test playback controls

## Docker

The project includes Docker support:

```bash
# Build image
docker build -t ocp-mac-visualizer .

# Run container
docker run -p 3000:3000 ocp-mac-visualizer
```

## Questions?

- Open an issue for bugs or feature requests
- Join the [OpenVoiceOS Matrix chat](https://matrix.to/#/!XFpdtmgyCoPDxOMPpH:matrix.org?via=matrix.org)
- Check existing issues before creating new ones

## Code of Conduct

Be respectful and constructive. We're building tools for the OpenVoiceOS community - professionalism and clear communication are essential.

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.
