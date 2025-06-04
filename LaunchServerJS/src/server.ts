import { serve } from "bun";
import { handleMessage, BaseMessage } from "./network/protocol";

serve({
  port: 3000,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return undefined;
    }
    return new Response("WebSocket server only", { status: 400 });
  },
  websocket: {
    open(ws) {
      ws.send(JSON.stringify({ type: "welcome" }));
    },
    message(ws, data) {
      try {
        const msg: BaseMessage = JSON.parse(data.toString());
        handleMessage(ws, msg);
      } catch (err) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      }
    },
    close(ws) {
      // TODO: cleanup sessions
    },
  },
});

console.log("Server running on ws://localhost:3000");
=======
import { Logger } from './utils/log';

process.on('uncaughtException', (err: unknown) => {
  Logger.error(`Unhandled exception: ${err instanceof Error ? err.stack : err}`);
});

process.on('unhandledRejection', (reason: unknown) => {
  Logger.error(`Unhandled rejection: ${reason}`);
});

Logger.info('LaunchServer starting');

setInterval(() => {
  Logger.info('Server heartbeat');
}, 60000);
