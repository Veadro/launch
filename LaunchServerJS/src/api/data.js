const express = require('express');
const router = express.Router();

/**
 * @openapi
 * /data:
 *   get:
 *     summary: Retrieve game data
 *     responses:
 *       200:
 *         description: Data payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *             examples:
 *               sample:
 *                 summary: Example response
 *                 value:
 *                   data: ["item1", "item2"]
 */
router.get('/', (req, res) => {
  res.json({ data: ["item1", "item2"] });
});

module.exports = router;
