import { Structure } from './Structure';
import { GeoCoord } from '../GeoCoord';

export class MissileSite extends Structure {
  constructor(id: number, position: GeoCoord, hp: number, maxHP: number, ownerID: number) {
    super(id, position, hp, maxHP, ownerID);
  }
}
