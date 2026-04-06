/**
 * Public (unauthenticated) read-only routes for the conference website.
 */
const express = require('express');
const router = express.Router();
const prisma = require('../../utils/prisma');

// Speakers
router.get('/speakers', async (_req, res, next) => {
  try {
    const data = await prisma.speaker.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Workshops (with sessions)
router.get('/workshops', async (_req, res, next) => {
  try {
    const data = await prisma.workshop.findMany({
      orderBy: { order: 'asc' },
      include: { sessions: { orderBy: { order: 'asc' } } },
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Important Dates
router.get('/dates', async (_req, res, next) => {
  try {
    const data = await prisma.importantDate.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Tracks (with topics)
router.get('/tracks', async (_req, res, next) => {
  try {
    const data = await prisma.track.findMany({
      orderBy: { order: 'asc' },
      include: { topics: { orderBy: { order: 'asc' } } },
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

module.exports = router;
