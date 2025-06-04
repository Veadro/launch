const WebSocket = require('ws');
const EventEmitter = require('events');

class Game extends EventEmitter {
  constructor() {
    super();
  }

  // Example action handlers.
  movePlayer(playerId, x, y) {
    this.emit('entityChange', { type: 'move', id: playerId, x, y });
  }

  fireMissile(playerId, targetId) {
    this.emit('entityChange', { type: 'missile', id: playerId, targetId });
  }

  handleAction(action) {
    const { type, payload } = action;
    switch (type) {
      case 'move':
        if (payload && typeof payload.playerId === 'number' &&
            typeof payload.x === 'number' && typeof payload.y === 'number') {
          this.movePlayer(payload.playerId, payload.x, payload.y);
        }
        break;
      case 'fireMissile':
        if (payload && typeof payload.playerId === 'number' &&
            typeof payload.targetId === 'number') {
          this.fireMissile(payload.playerId, payload.targetId);
        }
        break;
      default:
        // Unknown actions are ignored.
        break;
    }
  }
}

const legacyMap = {
  MOVE: 'move',
  FIRE: 'fireMissile',
};

const wss = new WebSocket.Server({ port: 8080 });
const game = new Game();

function broadcast(data) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

wss.on('connection', ws => {
  ws.on('message', message => {
    if (message.length > 1024) {
      return; // drop overly large messages
    }
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      return; // ignore invalid JSON
    }
    const mappedType = legacyMap[data.type] || data.type;
    if (!mappedType) return;
    game.handleAction({ type: mappedType, payload: data.payload });
  });
});

game.on('entityChange', change => {
  broadcast(JSON.stringify(change));
});

console.log('WebSocket bridge running on port 8080');
