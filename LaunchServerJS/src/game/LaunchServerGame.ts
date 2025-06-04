import { LaunchGame } from './LaunchGame';
import { Player } from './entities/Player';
import { MissileSite } from './entities/MissileSite';
import { SAMSite } from './entities/SAMSite';

export class LaunchServerGame extends LaunchGame {
  addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  addMissileSite(site: MissileSite) {
    this.missileSites.set(site.id, site);
  }

  addSAMSite(site: SAMSite) {
    this.samSites.set(site.id, site);
  }

  protected async gameTick(ms: number): Promise<void> {
    await super.gameTick(ms);
    // Additional server side logic would go here
  }
}
