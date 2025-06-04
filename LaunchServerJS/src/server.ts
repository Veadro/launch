import { serve } from "bun";
import { Logger } from "./utils/log";

interface Session {
  id: number;
  ws: WebSocket;
  userId?: string;
}

// In memory session store
const sessions = new Map<number, Session>();
let nextSessionId = 1;

// Basic game hooks to be extended later
export const gameHooks = {
  onAuth(session: Session, token: string) {
    // Placeholder for future authentication/game logic integration
  },
  onMessage(session: Session, data: any) {
    // Placeholder for future game logic message handling
  },
};

function broadcast(payload: any, excludeId?: number) {
  const message = JSON.stringify(payload);
  for (const session of sessions.values()) {
    if (excludeId !== undefined && session.id === excludeId) continue;
    session.ws.send(message);
  }
}

function sendTo(id: number, payload: any) {
  const session = sessions.get(id);
  if (session) {
    session.ws.send(JSON.stringify(payload));
  }
}

const server = serve({
  port: Number(process.env.PORT) || 3000,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // WebSocket upgrade will handle the request
    }
    return new Response("Launch Server JS running", { status: 200 });
  },
  websocket: {
    open(ws) {
      const id = nextSessionId++;
      const session: Session = { id, ws };
      sessions.set(id, session);
      (ws as any).data = id; // store id on websocket for lookup
      ws.send(JSON.stringify({ type: "connected", id }));
    },
    message(ws, message) {
      const id = (ws as any).data as number;
      const session = sessions.get(id);
      if (!session) return;

      let data: any;
      try {
        data = JSON.parse(message.toString());
      } catch {
        ws.send(JSON.stringify({ type: "error", error: "Invalid JSON" }));
        return;
      }

      if (!session.userId) {
        if (data && data.type === "auth" && typeof data.token === "string") {
          session.userId = data.token; // simplistic auth
          gameHooks.onAuth(session, data.token);
          ws.send(JSON.stringify({ type: "auth", status: "ok", userId: session.userId }));
        } else {
          ws.send(JSON.stringify({ type: "error", error: "Authentication required" }));
        }
        return;
      }

      // handle broadcast/targeted messages
      if (data.type === "broadcast") {
        broadcast({ from: session.id, payload: data.payload }, session.id);
      } else if (data.type === "target" && typeof data.to === "number") {
        sendTo(data.to, { from: session.id, payload: data.payload });
      } else {
        gameHooks.onMessage(session, data);
      }
    },
    close(ws) {
      const id = (ws as any).data as number;
      sessions.delete(id);
    },
  },
});

  console.log(`LaunchServerJS listening on ${server.hostname}:${server.port}`);

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
