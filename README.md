# launch
Real world RTS for Android

Aspirations are to randomize player locations each week and use mars instead of earth for the map. Players actual GPS stays hidden and only an offset is applied to in game locations

## MCP Service

The `mcp/` directory contains a lightweight Express service that exposes REST
endpoints for managing games and missions. Endpoints are secured with a simple
OAuth bearer token middleware. API documentation for these endpoints is
available in `mcp/openapi.yaml`.
