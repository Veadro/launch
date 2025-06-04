const express = require('express');
const GameService = require('./services/GameService');
const PlayerService = require('./services/PlayerService');
const oauthMiddleware = require('./oauthMiddleware');

const app = express();
app.use(express.json());
app.use(oauthMiddleware);

// List active games
app.get('/games/active', (req, res) => {
  res.json(GameService.listActiveGames());
});

// Create mission
app.post('/missions', (req, res) => {
  const mission = GameService.createMission(req.body);
  res.status(201).json(mission);
});

// Administrative command
app.post('/admin/commands', (req, res) => {
  // For demo purposes, just echo the command
  res.json({ result: `Executed ${req.body.command}` });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`MCP service listening on port ${port}`);
});
