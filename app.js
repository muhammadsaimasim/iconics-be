require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const workshopRouter = require('./api/routers/workshop.router');
const participantRouter = require('./api/routers/participant.router');
const paperRouter = require('./api/routers/paper.router');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/register/workshop', workshopRouter);
app.use('/api/register/participant', participantRouter);
app.use('/api/register/paper', paperRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`ICONICS Backend running on http://localhost:${PORT}`);
});
