import { Issuer, generators, TokenSet, Client } from 'openid-client';
import { MemorySessionStore, SessionStore, Session } from '../store/session';

export interface AuthConfig {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  sessionStore?: SessionStore;
}

export class Auth {
  private client: Client | undefined;
  private config: AuthConfig;
  private store: SessionStore;

  constructor(config: AuthConfig) {
    this.config = config;
    this.store = config.sessionStore || new MemorySessionStore();
  }

  async init() {
    const issuer = await Issuer.discover(this.config.issuerUrl);
    this.client = new issuer.Client({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uris: [this.config.redirectUri],
      response_types: ['code']
    });
  }

  async handleCallback(url: URL) {
    if (!this.client) throw new Error('Auth not initialized');
    const params = this.client.callbackParams(url);
    const tokenSet: TokenSet = await this.client.callback(this.config.redirectUri, params, { code_verifier: params.code_verifier });
    const sessionId = generators.random();
    const session: Session = {
      id: sessionId,
      accessToken: tokenSet.access_token as string,
      refreshToken: tokenSet.refresh_token,
      expiresAt: tokenSet.expires_at,
      user: tokenSet.claims()
    };
    await this.store.set(sessionId, session);
    return session;
  }

  async validate(token: string): Promise<Session | undefined> {
    if ('entries' in this.store) {
      for (const [, session] of (this.store as MemorySessionStore).entries()) {
        if (session.accessToken === token) {
          if (!session.expiresAt || Date.now() / 1000 < session.expiresAt) {
            return session;
          }
        }
      }
    }
    return undefined;
  }
}
