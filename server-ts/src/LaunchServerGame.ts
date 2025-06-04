export interface Config {}
export interface LaunchServerAppInterface {
  saveTheGame(): void;
}

export interface User {
  id: number;
  name: string;
}

export class LaunchServerGame {
  // Previously AtomicInteger counters
  private indices = {
    alliance: 0,
    treaty: 0,
    player: 0,
    loot: 0,
    missileSite: 0,
    samSite: 0,
    sentryGun: 0,
    oreMine: 0,
    radiation: 0,
    missile: 0,
    interceptor: 0,
    proscribedIP: 0,
    proscribedLocation: 0,
  };

  // Constants previously static
  private readonly HP_PER_INTERVAL = 1;
  private readonly CHARGE_INTERVAL = 3600000;
  private readonly BACKUP_INTERVAL = 7200000;

  private users: Map<string, User> = new Map();
  // Example entity collections
  private alliances: Map<number, unknown> = new Map();
  private treaties: Map<number, unknown> = new Map();
  // ... other collections omitted for brevity

  constructor(private config: Config, private app: LaunchServerAppInterface, private port: number) {}

  private nextId(key: keyof typeof this.indices, map: Map<number, unknown>): number {
    let id = (this as any).indices[key] + 1;
    (this as any).indices[key] = id;
    while (map.has(id) || id === 0) {
      id = ++(this as any).indices[key];
    }
    return id;
  }

  addUser(imei: string, user: User): void {
    this.users.set(imei, user);
  }

  // Sample method using counters
  createAlliance(): number {
    const id = this.nextId('alliance', this.alliances);
    this.alliances.set(id, {});
    return id;
  }
}
