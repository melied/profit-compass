require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const ideasRouter = require('./routes/ideas');
const sessionsRouter = require('./routes/sessions');
const { initDb } = require('./services/db');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());

// Rate limiting: 20 idea generations per hour per IP
const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Please try again in an hour.' },
});

// Routes
app.use('/api/ideas', generateLimiter, ideasRouter);
app.use('/api/sessions', sessionsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Init DB then start server
initDb();
app.listen(PORT, () => {
  console.log(`Profit Compass API running on http://localhost:${PORT}`);
});
