class GameService {
  constructor() {
    this.activeGames = [];
  }

  listActiveGames() {
    return this.activeGames;
  }

  createMission(mission) {
    this.activeGames.push(mission);
    return mission;
  }
}

module.exports = new GameService();
