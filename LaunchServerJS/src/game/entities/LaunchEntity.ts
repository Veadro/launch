import { GeoCoord } from '../GeoCoord';

export abstract class LaunchEntity {
  constructor(public id: number, public position: GeoCoord) {}
  abstract tick(ms: number): void;
  // Placeholder for event update
  protected changed(ownerOnly = false): void {
    // Would notify listeners in real implementation
  }
}
