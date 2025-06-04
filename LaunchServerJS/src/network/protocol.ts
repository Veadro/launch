export enum MessageType {
  AUTHORISE = 'authorise',
  LOCATION_UPDATE = 'locationUpdate',
  KEEP_ALIVE = 'keepAlive'
}

export interface BaseMessage {
  type: MessageType;
}

export interface AuthoriseMessage extends BaseMessage {
  type: MessageType.AUTHORISE;
=======
export interface BaseMessage {
  type: string;
}

export interface AuthoriseMessage extends BaseMessage {
  type: "authorise";
  deviceId: string;
  version: string;
}

export interface LocationUpdateMessage extends BaseMessage {
  type: MessageType.LOCATION_UPDATE;
  latitude: number;
  longitude: number;
}

export interface KeepAliveMessage extends BaseMessage {
  type: MessageType.KEEP_ALIVE;
}

export type LaunchMessage =
  | AuthoriseMessage
  | LocationUpdateMessage
  | KeepAliveMessage;

export function serializeMessage(message: LaunchMessage): string {
  return JSON.stringify(message);
}

export function parseMessage(json: string): LaunchMessage {
  return JSON.parse(json) as LaunchMessage;
=======
export type ClientMessage = AuthoriseMessage | BaseMessage;

export function handleMessage(ws: WebSocket, msg: ClientMessage) {
  switch (msg.type) {
    case "authorise":
      // TODO authenticate deviceId/version
      ws.send(JSON.stringify({ type: "authorised" }));
      break;
    default:
      ws.send(JSON.stringify({ type: "error", message: "Unknown message" }));
  }
}
