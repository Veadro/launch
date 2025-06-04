const express = require('express');
const router = express.Router();

/**
 * @openapi
 * /commands:
 *   post:
 *     summary: Submit commands to the server
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commands:
 *                 type: array
 *                 items:
 *                   type: string
 *           examples:
 *             sample:
 *               summary: Example request
 *               value:
 *                 commands: ["move", "attack"]
 *     responses:
 *       200:
 *         description: Command acknowledgement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *             examples:
 *               sample:
 *                 summary: Example response
 *                 value:
 *                   status: "ok"
 */
router.post('/', (req, res) => {
  const { commands } = req.body;
  if (!Array.isArray(commands)) {
    return res.status(400).json({ error: 'commands must be an array' });
  }
  res.json({ status: 'ok' });
});

module.exports = router;
