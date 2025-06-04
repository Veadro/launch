import { Damagable } from './Damagable';
import { GeoCoord } from '../GeoCoord';
import { Delay } from '../Delay';

export class Player extends Damagable {
  public name: string;
  public avatarID: number;
  public wealth: number;
  public allianceID: number = 0;
  public respawnDelay = new Delay();
  public respawnProtected = true;
  public awol = false;

  constructor(id: number, position: GeoCoord, hp: number, maxHP: number, name: string, avatarID: number, wealth: number) {
    super(id, position, hp, maxHP);
    this.name = name;
    this.avatarID = avatarID;
    this.wealth = wealth;
  }

  tick(ms: number): void {
    this.respawnDelay.tick(ms);
    if (this.awol && this.respawnDelay.expired()) {
      this.awol = false;
      this.respawnProtected = false;
      this.addHP(this.maxHP);
    }
  }
}
