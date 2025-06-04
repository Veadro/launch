# Network Protocol

LaunchServerJS communicates using JSON encoded messages. Each message includes a
`type` field which replaces the numeric message identifiers used in the legacy
Java implementation. The protocol currently defines the following messages:

## BaseMessage
```ts
interface BaseMessage {
  type: MessageType;
}
```

## AuthoriseMessage
```ts
interface AuthoriseMessage extends BaseMessage {
  type: MessageType.AUTHORISE;
  deviceId: string;
  version: string;
}
```
Sent by a client when connecting to the server. The server verifies the device
and game version before allowing further communication.

## LocationUpdateMessage
```ts
interface LocationUpdateMessage extends BaseMessage {
  type: MessageType.LOCATION_UPDATE;
  latitude: number;
  longitude: number;
}
```
Periodic location update from the client.

## KeepAliveMessage
```ts
interface KeepAliveMessage extends BaseMessage {
  type: MessageType.KEEP_ALIVE;
}
```
Used when no other data needs to be sent to maintain the connection.

## Serialisation

Messages are encoded and decoded with the helper functions provided in
`src/network/protocol.ts`:

```ts
serializeMessage(message: LaunchMessage): string
parseMessage(json: string): LaunchMessage
```

These convert between TypeScript objects and their JSON string representation.

