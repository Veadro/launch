class PlayerService {
  constructor() {
    this.players = [];
  }

  getPlayers() {
    return this.players;
  }

  addPlayer(player) {
    this.players.push(player);
    return player;
  }
}

module.exports = new PlayerService();
