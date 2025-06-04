# JSON Network Protocol

All messages are JSON objects with a mandatory `type` field.

## Authorise

Client -> Server
```json
{ "type": "authorise", "deviceId": "abc", "version": "1.0" }
```

Server -> Client
```json
{ "type": "authorised" }
```
