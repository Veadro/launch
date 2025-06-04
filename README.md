# launch
Real world RTS for Android

Aspirations are to randomize player locations each week and use mars instead of earth for the map. Players actual GPS stays hidden and only an offset is applied to in game locations

## WebSocket Bridge

A simple Node.js server under `wsbridge/` exposes game actions over WebSockets and
broadcasts JSON updates whenever in-game entities change. Run it with:

```bash
cd wsbridge
node server.js
```

Incoming messages should be JSON objects with a `type` field and optional
`payload`. Legacy message names such as `MOVE` or `FIRE` are automatically mapped
to the new action names.
