export class GeoCoord {
  constructor(public latitude: number = 0, public longitude: number = 0) {}

  distanceTo(other: GeoCoord): number {
    const latDiff = this.latitude - other.latitude;
    const lonDiff = this.longitude - other.longitude;
    return Math.hypot(latDiff, lonDiff);
  }
}
