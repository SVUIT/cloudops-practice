const express = require('express');
const router = express.Router();
const client = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
