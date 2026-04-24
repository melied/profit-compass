const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../services/db');

const router = express.Router();

// GET /api/sessions/:id — restore a session
router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Session not found' });

  res.json({
    sessionId: row.id,
    answers: JSON.parse(row.answers),
    ideas: row.ideas ? JSON.parse(row.ideas) : null,
    favorites: JSON.parse(row.favorites || '[]'),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
});

// PATCH /api/sessions/:id/favorites — save/update favorites
router.patch('/:id/favorites', (req, res) => {
  const { favorites } = req.body;
  if (!Array.isArray(favorites)) {
    return res.status(400).json({ error: 'favorites must be an array' });
  }
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);
  db.prepare('UPDATE sessions SET favorites = ?, updated_at = ? WHERE id = ?')
    .run(JSON.stringify(favorites), now, req.params.id);
  res.json({ ok: true });
});

// DELETE /api/sessions/:id — clear a session
router.delete('/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
