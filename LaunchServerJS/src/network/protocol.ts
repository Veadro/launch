export interface BaseMessage {
  type: string;
}

export interface AuthoriseMessage extends BaseMessage {
  type: "authorise";
  deviceId: string;
  version: string;
}

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
