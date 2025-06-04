import { serve } from 'bun';
import { generators } from 'openid-client';
import { Auth } from './auth';
import { MemorySessionStore, Session } from './store/session';
import { UserStore, User } from './store/user';
import { GoldStore, Gold } from './store/gold';
import { parse as parseCookie, serialize as serializeCookie } from 'cookie';

const auth = new Auth({
  issuerUrl: 'https://accounts.google.com',
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  sessionStore: new MemorySessionStore()
});
await auth.init();

const users = new UserStore();
const goldStore = new GoldStore();
const stateStore = new Map<string, string>();

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000; // earth radius m
  const dLat = (bLat - aLat) * Math.PI / 180;
  const dLng = (bLng - aLng) * Math.PI / 180;
  const sLat1 = aLat * Math.PI / 180;
  const sLat2 = bLat * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.sin(dLng/2)**2 * Math.cos(sLat1) * Math.cos(sLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function offsetLatLng(lat: number, lng: number, meters: number, bearing: number) {
  const R = 6371000;
  const angDist = meters / R;
  const br = bearing * Math.PI / 180;
  const lat1 = lat * Math.PI / 180;
  const lng1 = lng * Math.PI / 180;
  const lat2 = Math.asin(Math.sin(lat1)*Math.cos(angDist) + Math.cos(lat1)*Math.sin(angDist)*Math.cos(br));
  const lng2 = lng1 + Math.atan2(Math.sin(br)*Math.sin(angDist)*Math.cos(lat1), Math.cos(angDist)-Math.sin(lat1)*Math.sin(lat2));
  return { lat: lat2 * 180/Math.PI, lng: lng2 * 180/Math.PI };
}

function spawnGoldAround(user: User) {
  const existing = goldStore.list().filter(g => distanceMeters(g.lat, g.lng, user.lat!, user.lng!) < 1600);
  if (existing.length >= 5) return;
  const count = 5 - existing.length;
  for (let i=0;i<count;i++) {
    const dist = 150 + Math.random() * (1600-150);
    const bearing = Math.random()*360;
    const pos = offsetLatLng(user.lat!, user.lng!, dist, bearing);
    const gold = goldStore.add({ lat: pos.lat, lng: pos.lng, value: Math.floor(Math.random()*5)+1 });
    broadcast({ type: 'goldSpawn', id: gold.id, lat: gold.lat, lng: gold.lng });
  }
}

const sessions = new Map<number, { ws: WebSocket; user: User }>();
let nextSessionId = 1;

function broadcast(payload: any) {
  const msg = JSON.stringify(payload);
  for (const s of sessions.values()) s.ws.send(msg);
}

function handleLocation(user: User) {
  spawnGoldAround(user);
  for (const gold of goldStore.list()) {
    if (distanceMeters(user.lat!, user.lng!, gold.lat, gold.lng) < 20) {
      goldStore.remove(gold.id);
      user.gold += gold.value;
      broadcast({ type: 'goldCollected', userId: user.id, goldId: gold.id, amount: gold.value, gold: user.gold });
    }
  }
}

const server = serve({
  port: Number(process.env.PORT) || 3000,
  async fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === '/login') {
      const state = generators.random();
      const code_verifier = generators.codeVerifier();
      const code_challenge = generators.codeChallenge(code_verifier);
      stateStore.set(state, code_verifier);
      const client = (auth as any).client;
      const loginUrl = client.authorizationUrl({
        scope: 'openid email profile',
        state,
        code_challenge,
        code_challenge_method: 'S256'
      });
      return new Response(null, { status:302, headers:{ Location: loginUrl } });
    }
    if (url.pathname === '/auth/callback') {
      const state = url.searchParams.get('state') || '';
      const code_verifier = stateStore.get(state);
      stateStore.delete(state);
      const session = await auth.handleCallback(url, code_verifier);
      const googleId = session.user.sub;
      let user = users.findByGoogleId(googleId);
      if (!user) user = users.create(googleId, session.user.name || 'player');
      const cookie = serializeCookie('session', session.id, { path:'/', httpOnly:true });
      return new Response(null, { status:302, headers:{ Location:'/', 'Set-Cookie': cookie } });
    }
    if (url.pathname === '/session') {
      const cookies = parseCookie(req.headers.get('cookie') || '');
      const sid = cookies['session'];
      if (!sid) return new Response('unauth', { status:401 });
      const sess = await auth.validate(sid);
      if (!sess) return new Response('unauth', { status:401 });
      const user = users.findByGoogleId(sess.user.sub);
      if (!user) return new Response('unauth', { status:401 });
      return json({ id: user.id, name: user.name, gold: user.gold });
    }
    if (url.pathname === '/ws' && server.upgrade(req)) {
      return;
    }
    return new Response('ok');
  },
  websocket: {
    open(ws) {
      const id = nextSessionId++;
      const cookies = parseCookie(ws.data.headers.get('cookie') || '');
      const sid = cookies['session'];
      if (!sid) { ws.close(); return; }
      auth.validate(sid).then(sess => {
        if (!sess) { ws.close(); return; }
        let user = users.findByGoogleId(sess.user.sub);
        if (!user) user = users.create(sess.user.sub, sess.user.name || 'player');
        sessions.set(id, { ws, user });
        ws.send(JSON.stringify({ type:'init', user:{ id:user.id, name:user.name, gold:user.gold }, gold: goldStore.list() }));
      });
      (ws as any).id = id;
    },
    message(ws, msg) {
      const session = sessions.get((ws as any).id);
      if (!session) return;
      let data: any;
      try { data = JSON.parse(msg.toString()); } catch { return; }
      if (data.type === 'locationUpdate') {
        session.user.lat = data.latitude;
        session.user.lng = data.longitude;
        handleLocation(session.user);
      } else if (data.type === 'chat' && typeof data.message === 'string') {
        broadcast({ type:'chat', from: session.user.name, message: data.message });
      }
    },
    close(ws) {
      const id = (ws as any).id;
      sessions.delete(id);
    }
  }
});

console.log(`Server running on ${server.hostname}:${server.port}`);
