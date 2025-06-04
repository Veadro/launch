declare const Bun: { setInterval: typeof setInterval; clearInterval: typeof clearInterval; };
import { Player } from './entities/Player';
import { MissileSite } from './entities/MissileSite';
import { SAMSite } from './entities/SAMSite';

export abstract class LaunchGame {
  protected players = new Map<number, Player>();
  protected missileSites = new Map<number, MissileSite>();
  protected samSites = new Map<number, SAMSite>();

  protected TICK_RATE = 1000;
  private gameInterval?: ReturnType<typeof setInterval>;

  start() {
    if (!this.gameInterval) {
      this.gameInterval = Bun.setInterval(async () => {
        await this.gameTick(this.TICK_RATE);
      }, this.TICK_RATE);
    }
  }

  stop() {
    if (this.gameInterval) {
      Bun.clearInterval(this.gameInterval);
      this.gameInterval = undefined;
    }
  }

  protected async gameTick(ms: number): Promise<void> {
    for (const player of this.players.values()) {
      if (!player.awol) player.tick(ms);
      if (player.destroyed()) this.players.delete(player.id);
    }

    for (const site of this.missileSites.values()) {
      site.tick(ms);
      if (site.destroyed()) this.missileSites.delete(site.id);
    }

    for (const site of this.samSites.values()) {
      site.tick(ms);
      if (site.destroyed()) this.samSites.delete(site.id);
    }
  }
}
