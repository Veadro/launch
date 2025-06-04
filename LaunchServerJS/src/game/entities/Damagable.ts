import { LaunchEntity } from './LaunchEntity';
import { GeoCoord } from '../GeoCoord';

export abstract class Damagable extends LaunchEntity {
  constructor(id: number, position: GeoCoord, public hp: number, public maxHP: number) {
    super(id, position);
  }

  inflictDamage(amount: number): number {
    const inflicted = Math.min(this.hp, amount);
    this.hp -= inflicted;
    if (this.hp < 0) this.hp = 0;
    this.changed();
    return inflicted;
  }

  addHP(amount: number): void {
    this.hp = Math.min(this.maxHP, this.hp + amount);
    this.changed();
  }

  destroyed(): boolean {
    return this.hp <= 0;
  }
}
