import { Damagable } from './Damagable';
import { GeoCoord } from '../GeoCoord';
import { Delay } from '../Delay';

export type StructureState = 'offline' | 'booting' | 'online' | 'selling';

export abstract class Structure extends Damagable {
  public name = '';
  public state: StructureState = 'offline';
  protected stateDelay = new Delay();
  protected chargeDelay = new Delay();
  public respawnProtected = false;

  constructor(id: number, position: GeoCoord, hp: number, maxHP: number, public ownerID: number) {
    super(id, position, hp, maxHP);
  }

  tick(ms: number): void {
    this.stateDelay.tick(ms);
    this.chargeDelay.tick(ms);

    if (this.state === 'booting' && this.stateDelay.expired()) {
      this.state = 'online';
      this.changed();
    }
  }

  bringOnline(bootTime: number) {
    this.state = 'booting';
    this.stateDelay.set(bootTime);
  }

  takeOffline() {
    this.state = 'offline';
  }
}
