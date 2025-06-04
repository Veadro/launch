import { serve } from 'bun';
import { Auth, AuthConfig } from './auth';
import { createAuthMiddleware } from './middleware/auth';
import { createWsAuthMiddleware } from './middleware/wsAuth';

const config: AuthConfig = {
  issuerUrl: process.env.OIDC_ISSUER!,
  clientId: process.env.OIDC_CLIENT_ID!,
  clientSecret: process.env.OIDC_CLIENT_SECRET!,
  redirectUri: process.env.OIDC_REDIRECT_URI!,
};

const auth = new Auth(config);
auth.init();

const authMiddleware = createAuthMiddleware(auth);
const wsAuthMiddleware = createWsAuthMiddleware(auth);

serve<{ session?: any }>({
  fetch: async (req, server) => {
    const url = new URL(req.url);

    if (url.pathname === '/auth/callback') {
      const session = await auth.handleCallback(url);
      return new Response(JSON.stringify(session), { headers: { 'content-type': 'application/json' } });
    }

    if (url.pathname.startsWith('/api')) {
      const session = await authMiddleware(req);
      if (session instanceof Response) return session;
      return new Response('ok');
    }

    if (server.upgrade(req)) {
      return undefined;
    }

    return new Response('Not Found', { status: 404 });
  },
  websocket: {
    open: async (ws) => {
      const session = await wsAuthMiddleware(ws.data.request);
      if (!session) ws.close(1008, 'Unauthorized');
      else ws.subscribe('authorized');
    },
    message: (ws, message) => {
      ws.send(message);
    }
  }
});
