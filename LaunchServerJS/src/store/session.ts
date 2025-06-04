export interface Session {
  id: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user?: any;
}

export interface SessionStore {
  get(id: string): Session | undefined | Promise<Session | undefined>;
  set(id: string, session: Session): void | Promise<void>;
  delete(id: string): void | Promise<void>;
}

export class MemorySessionStore implements SessionStore {
  private store = new Map<string, Session>();

  entries() {
    return this.store.entries();
  }

  get(id: string) {
    return this.store.get(id);
  }

  set(id: string, session: Session) {
    this.store.set(id, session);
  }

  delete(id: string) {
    this.store.delete(id);
  }
}
