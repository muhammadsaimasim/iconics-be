require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const workshopRouter = require('./api/routers/workshop.router');
const participantRouter = require('./api/routers/participant.router');
const paperRouter = require('./api/routers/paper.router');
const adminRouter = require('./api/routers/admin.router');
const publicRouter = require('./api/routers/public.router');

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://nediconics.vercel.app',
  'https://iconics.neduet.edu.pk',
  'https://www.iconics.neduet.edu.pk',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static uploads ─────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ─── Routes ─────────────────────────────────────────────────────────────────

app.use('/api/register/workshop', workshopRouter);
app.use('/api/register/participant', participantRouter);
app.use('/api/register/paper', paperRouter);
app.use('/api/admin', adminRouter);
app.use('/api/public', publicRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error handler ──────────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// ─── Start (local dev) / Export (Vercel) ────────────────────────────────────

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ICONICS Backend running on http://localhost:${PORT}`);
  });


module.exports = app;
