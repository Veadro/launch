# LaunchServerJS

A lightweight game server written with [Bun](https://bun.sh/).

## Getting Started

Install dependencies and start the development server:

```bash
bun install
bun run src/server.ts
```

Build and run the bundled server:

```bash
bun run build
bun run start
```

The server entry file is [`src/server.ts`](src/server.ts).

This project was created using `bun init` in bun v1.2.14. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Additional Node.js utilities can be found under this package:

- **wsbridge** – simple WebSocket bridge exposing game actions
- **mcp** – lightweight REST service with OAuth middleware

See [docs/network.md](docs/network.md) for message format details.
