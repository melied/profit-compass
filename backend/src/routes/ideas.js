const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { generateIdeas } = require('../services/anthropic');
const { getDb } = require('../services/db');

const router = express.Router();

// POST /api/ideas/generate
// Body: { answers: {...}, sessionId?: string }
router.post('/generate', async (req, res) => {
  const { answers, sessionId } = req.body;

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'answers object is required' });
  }

  try {
    const result = await generateIdeas(answers);
    const db = getDb();
    const id = sessionId || uuidv4();
    const now = Math.floor(Date.now() / 1000);

    const existing = db.prepare('SELECT id FROM sessions WHERE id = ?').get(id);
    if (existing) {
      db.prepare(
        'UPDATE sessions SET answers = ?, ideas = ?, updated_at = ? WHERE id = ?'
      ).run(JSON.stringify(answers), JSON.stringify(result), now, id);
    } else {
      db.prepare(
        'INSERT INTO sessions (id, answers, ideas, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
      ).run(id, JSON.stringify(answers), JSON.stringify(result), now, now);
    }

    res.json({ sessionId: id, ...result });
  } catch (err) {
    console.error('Generation error:', err.message);
    if (err.message.includes('JSON')) {
      return res.status(502).json({ error: 'AI returned an unexpected format. Please retry.' });
    }
    res.status(500).json({ error: 'Failed to generate ideas. Please try again.' });
  }
});

module.exports = router;
