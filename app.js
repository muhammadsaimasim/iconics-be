require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const workshopRouter = require('./api/routers/workshop.router');
const participantRouter = require('./api/routers/participant.router');
const paperRouter = require('./api/routers/paper.router');
const adminRouter = require('./api/routers/admin.router');
const publicRouter = require('./api/routers/public.router');
const { globalLimiter } = require('./api/middlewares/rateLimit.middleware');

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────

// Behind nginx: trust exactly one proxy hop so req.ip (used by rate limiting)
// is the real client address, not nginx's, and can't be spoofed further.
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 1));
app.disable('x-powered-by');

// JSON API: the strictest CSP is fine (it only applies to API responses).
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
  crossOriginResourcePolicy: { policy: 'same-site' },
}));

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
      callback(Object.assign(new Error('Not allowed by CORS'), { status: 403, expose: true }));
    }
  },
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(globalLimiter);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// ─── Static uploads ─────────────────────────────────────────────────────────
// Only CFP poster images and the LaTeX template zip live here. nosniff stops a
// browser from treating any file as HTML; the sandbox CSP neuters scripts if
// one ever is; non-images download instead of rendering.
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir, {
  dotfiles: 'deny',
  index: false,
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; sandbox");
    if (!/\.(png|jpe?g|webp)$/i.test(filePath)) {
      res.setHeader('Content-Disposition', 'attachment');
    }
  },
}));

// ─── Routes ─────────────────────────────────────────────────────────────────

app.use('/api/register/workshop', workshopRouter);
app.use('/api/register/participant', participantRouter);
app.use('/api/register/paper', paperRouter);
app.use('/api/admin', adminRouter);
app.use('/api/public', publicRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// ─── Error handler ──────────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error('Unhandled error:', err);
  // Only messages written for clients (4xx / err.expose) are sent back. Internal
  // errors (Prisma, Supabase, stack details) never leave the server, whatever
  // NODE_ENV is set to.
  res.status(status).json({
    success: false,
    message: status < 500 && err.expose !== false ? err.message : 'Internal server error',
  });
});

// ─── Start ──────────────────────────────────────────────────────────────────

// Listen on loopback only: nginx is the sole public entry point (TLS, headers,
// limits). Set HOST=0.0.0.0 only for setups without a local reverse proxy.
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, () => {
  console.log(`ICONICS Backend running on http://${HOST}:${PORT}`);
});

module.exports = app;
