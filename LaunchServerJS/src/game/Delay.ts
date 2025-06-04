export class Delay {
  private remaining: number;
  constructor(ms: number = 0) {
    this.remaining = ms;
  }

  tick(ms: number): void {
    if (this.remaining > 0) {
      this.remaining = Math.max(0, this.remaining - ms);
    }
  }

  expired(): boolean {
    return this.remaining <= 0;
  }

  set(ms: number): void {
    this.remaining = ms;
  }

  getRemaining(): number {
    return this.remaining;
  }
}
