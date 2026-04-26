require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const ideasRouter = require('./routes/ideas');
const sessionsRouter = require('./routes/sessions');
const { initDb } = require('./services/db');

const app = express();
const PORT = process.env.PORT || 4000;

// ========================
// Middleware
// ========================

// ✅ CORS (حل نهائي 100%)
app.use(cors());

// إذا تريد تقييد لاحقًا استخدم:
// app.use(cors({ origin: '*' }));

app.use(express.json());

// ========================
// Rate limiting
// ========================
const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة
  max: 20,
  message: { error: 'Too many requests. Please try again in an hour.' },
});

// ========================
// Routes
// ========================
app.use('/api/ideas', generateLimiter, ideasRouter);
app.use('/api/sessions', sessionsRouter);

// ========================
// Health check
// ========================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ========================
// Error handler
// ========================
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
  });
});

// ========================
// Start server
// ========================
initDb();

app.listen(PORT, () => {
  console.log(`🚀 Profit Compass API running on port ${PORT}`);
});
