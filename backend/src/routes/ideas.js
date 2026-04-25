const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../services/db');

const router = express.Router();

// POST /api/ideas/generate
router.post('/generate', async (req, res) => {
  const { answers, sessionId } = req.body;

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'answers object is required' });
  }

  try {
    // 🟢 أفكار مجانية (بدون AI)
    const ideas = [
      {
        title: "Freelance Writing",
        description: "Offer blog writing or copywriting services on platforms like Upwork.",
        score: 85
      },
      {
        title: "Print-on-Demand Store",
        description: "Sell custom t-shirts, mugs, and designs using platforms like Shopify.",
        score: 78
      },
      {
        title: "Sell Digital Products",
        description: "Create and sell ebooks, templates, or planners online.",
        score: 90
      },
      {
        title: "Social Media Management",
        description: "Manage accounts for small businesses and creators.",
        score: 82
      }
    ];

    const db = getDb();
    const id = sessionId || uuidv4();
    const now = Math.floor(Date.now() / 1000);

    const existing = db.prepare('SELECT id FROM sessions WHERE id = ?').get(id);

    if (existing) {
      db.prepare(
        'UPDATE sessions SET answers = ?, ideas = ?, updated_at = ? WHERE id = ?'
      ).run(JSON.stringify(answers), JSON.stringify(ideas), now, id);
    } else {
      db.prepare(
        'INSERT INTO sessions (id, answers, ideas, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
      ).run(id, JSON.stringify(answers), JSON.stringify(ideas), now, now);
    }

    res.json({ sessionId: id, ideas });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to generate ideas' });
  }
});

module.exports = router;
