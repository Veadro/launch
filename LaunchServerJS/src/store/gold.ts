import { v4 as uuidv4 } from 'uuid';

export interface Gold {
  id: string;
  lat: number;
  lng: number;
  value: number;
}

export class GoldStore {
  private gold = new Map<string, Gold>();

  list() {
    return Array.from(this.gold.values());
  }

  add(g: Omit<Gold, 'id'>): Gold {
    const gold: Gold = { ...g, id: uuidv4() };
    this.gold.set(gold.id, gold);
    return gold;
  }

  remove(id: string) {
    this.gold.delete(id);
  }
}
