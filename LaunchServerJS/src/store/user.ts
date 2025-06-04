import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  googleId: string;
  name: string;
  gold: number;
  lat?: number;
  lng?: number;
}

export class UserStore {
  private users = new Map<string, User>();

  findByGoogleId(googleId: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.googleId === googleId) return user;
    }
    return undefined;
  }

  get(id: string): User | undefined {
    return this.users.get(id);
  }

  create(googleId: string, name: string): User {
    const id = uuidv4();
    const user: User = { id, googleId, name, gold: 0 };
    this.users.set(id, user);
    return user;
  }

  update(user: User) {
    this.users.set(user.id, user);
  }
}
