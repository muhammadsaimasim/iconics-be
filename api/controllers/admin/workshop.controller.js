const prisma = require('../../../utils/prisma');
const { uploadFile } = require('../../../utils/supabase');

const getAll = async (_req, res, next) => {
  try {
    const workshops = await prisma.workshop.findMany({
      orderBy: { order: 'asc' },
      include: { sessions: { orderBy: { order: 'asc' } } },
    });
    res.json({ success: true, data: workshops });
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const { slug, title, tagline, description, registrationLink, targetAudience, learningOutcomes, order } = req.body;
    let posterImage = req.body.posterImage || null;
    if (req.file) {
      posterImage = await uploadFile(req.file.buffer, req.file.originalname, 'registrations', 'workshops');
    }
    const workshop = await prisma.workshop.create({
      data: {
        slug, title, tagline, description,
        posterImage, registrationLink: registrationLink || null,
        targetAudience: targetAudience || null,
        learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : JSON.parse(learningOutcomes || '[]'),
        order: parseInt(order) || 0,
      },
    });
    res.status(201).json({ success: true, data: workshop });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const { slug, title, tagline, description, registrationLink, targetAudience, learningOutcomes, order } = req.body;
    let posterImage = req.body.posterImage;
    if (req.file) {
      posterImage = await uploadFile(req.file.buffer, req.file.originalname, 'registrations', 'workshops');
    }
    const data = {
      slug, title, tagline, description,
      registrationLink: registrationLink || null,
      targetAudience: targetAudience || null,
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : JSON.parse(learningOutcomes || '[]'),
      order: parseInt(order) || 0,
    };
    if (posterImage !== undefined) data.posterImage = posterImage;
    const workshop = await prisma.workshop.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: workshop });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    await prisma.workshop.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { next(e); }
};

// ── Sessions ──────────────────────────────────────────────────────────────────

const getSessions = async (req, res, next) => {
  try {
    const sessions = await prisma.workshopSession.findMany({
      where: { workshopId: req.params.workshopId },
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: sessions });
  } catch (e) { next(e); }
};

const createSession = async (req, res, next) => {
  try {
    const { title, instructorName, instructorTitle, instructorInstitution, instructorCountry, topics, order } = req.body;
    let instructorPhoto = req.body.instructorPhoto || null;
    if (req.file) {
      instructorPhoto = await uploadFile(req.file.buffer, req.file.originalname, 'registrations', 'speakers');
    }
    const session = await prisma.workshopSession.create({
      data: {
        workshopId: req.params.workshopId,
        title, instructorName, instructorTitle, instructorInstitution, instructorCountry,
        instructorPhoto,
        topics: Array.isArray(topics) ? topics : JSON.parse(topics || '[]'),
        order: parseInt(order) || 0,
      },
    });
    res.status(201).json({ success: true, data: session });
  } catch (e) { next(e); }
};

const updateSession = async (req, res, next) => {
  try {
    const { title, instructorName, instructorTitle, instructorInstitution, instructorCountry, topics, order } = req.body;
    let instructorPhoto = req.body.instructorPhoto;
    if (req.file) {
      instructorPhoto = await uploadFile(req.file.buffer, req.file.originalname, 'registrations', 'speakers');
    }
    const data = {
      title, instructorName, instructorTitle, instructorInstitution, instructorCountry,
      topics: Array.isArray(topics) ? topics : JSON.parse(topics || '[]'),
      order: parseInt(order) || 0,
    };
    if (instructorPhoto !== undefined) data.instructorPhoto = instructorPhoto;
    const session = await prisma.workshopSession.update({ where: { id: req.params.sessionId }, data });
    res.json({ success: true, data: session });
  } catch (e) { next(e); }
};

const removeSession = async (req, res, next) => {
  try {
    await prisma.workshopSession.delete({ where: { id: req.params.sessionId } });
    res.json({ success: true });
  } catch (e) { next(e); }
};

module.exports = { getAll, create, update, remove, getSessions, createSession, updateSession, removeSession };
