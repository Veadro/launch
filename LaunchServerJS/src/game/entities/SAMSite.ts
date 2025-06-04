import { Structure } from './Structure';
import { GeoCoord } from '../GeoCoord';

export type SAMMode = 'auto' | 'semiAuto' | 'manual';

export class SAMSite extends Structure {
  public mode: SAMMode = 'auto';

  constructor(id: number, position: GeoCoord, hp: number, maxHP: number, ownerID: number) {
    super(id, position, hp, maxHP, ownerID);
  }
}
