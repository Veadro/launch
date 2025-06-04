# JSON Network Protocol

LaunchServerJS exchanges JSON messages over WebSockets. Every message contains a `type` field which identifies its purpose.

## Message Types

| Name | Direction | Example |
|------|-----------|---------|
| `authorise` | client -> server | `{ "type": "authorise", "deviceId": "abc", "version": "1.0.0" }` |
| `authorised` | server -> client | `{ "type": "authorised" }` |
| `locationUpdate` | client -> server | `{ "type": "locationUpdate", "latitude": 51.5, "longitude": -0.1 }` |
| `keepAlive` | client -> server | `{ "type": "keepAlive" }` |

See the root [docs/network.md](../../docs/network.md) for full TypeScript interfaces.
