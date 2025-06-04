# launch
Real world RTS for Android

Aspirations are to randomize player locations each week and use mars instead of earth for the map. Players actual GPS stays hidden and only an offset is applied to in game locations

## Directory Overview

| Folder | Language | How to Run/Build | Docs |
|--------|----------|-----------------|------|
| `LaunchServer` | Java (Ant) | `ant run` or open in NetBeans | [HOW TO DEPLOY](LaunchServer/HOW%20TO%20DEPLOY) |
| `LaunchClient` | Android (Java/Kotlin) | `./gradlew assembleDebug` | – |
| `LaunchServerJS` | TypeScript with Bun | `bun run src/server.ts` | [README](LaunchServerJS/README.md), [docs](LaunchServerJS/docs) |
| `LaunchServerJS/wsbridge` | Node.js | `node server.js` | – |
| `LaunchServerJS/mcp` | Node.js Express | `node index.js` | [openapi.yaml](LaunchServerJS/mcp/openapi.yaml) |
| `LaunchServerJS` | TypeScript with Bun | `bun run src/server.ts` | [README](LaunchServerJS/README.md), [network](docs/network.md) |
| `wsbridge` | Node.js | `node server.js` | – |
| `mcp` | Node.js Express | `node index.js` | [openapi.yaml](mcp/openapi.yaml) |
| `server-ts` | TypeScript | `npm run build` | – |
## WebSocket Bridge

A simple Node.js server under `LaunchServerJS/wsbridge/` exposes game actions over WebSockets and
broadcasts JSON updates whenever in-game entities change. Run it with:

```bash
cd LaunchServerJS/wsbridge
node server.js
```

Incoming messages should be JSON objects with a `type` field and optional
`payload`. Legacy message names such as `MOVE` or `FIRE` are automatically mapped
to the new action names.
## Running the Bun Server

The latest server implementation uses [Bun](https://bun.sh/) to provide a fast
TypeScript runtime. To start the server in development mode run:

```bash
bun run server.ts
```

By default the server listens on port `3000`. You can override this with the
`PORT` environment variable:

```bash
PORT=8080 bun run server.ts
```

When deploying you may wish to build the project first. Bun can produce a
single JavaScript bundle which can then be executed directly:

```bash
bun build server.ts --outfile dist/server.js
node dist/server.js
```
## Protocol Changes

Older versions of Launch relied on a custom binary protocol implemented in the
`TobComm` library. Messages were transmitted as byte arrays with manually coded
offsets for each field. The new implementation uses JSON over WebSockets. This
makes it much easier to inspect traffic and build tooling in other languages,
while still keeping the payloads small thanks to Bun's native JSON handling.
For a full list of message structures see [docs/network.md](docs/network.md).

## Running Tests

Tests for the Bun services can be executed with:

```bash
bun test
```

Existing Java modules still contain JUnit tests under `LaunchGame/test` which
can be run with your preferred Java IDE or with Ant/NetBeans.
## MCP Service

The `LaunchServerJS/mcp/` directory contains a lightweight Express service that exposes REST
endpoints for managing games and missions. Endpoints are secured with a simple
OAuth bearer token middleware. API documentation for these endpoints is
available in `LaunchServerJS/mcp/openapi.yaml`.
available in `mcp/openapi.yaml`.

## License

This project is licensed under the [MIT License](LICENSE).

