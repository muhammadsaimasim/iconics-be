const prisma = require('../../../utils/prisma');
const { uploadFile } = require('../../../utils/supabase');

const getAll = async (_req, res, next) => {
  try {
    const speakers = await prisma.speaker.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: speakers });
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const { name, title, institution, country, type, bio, topics, website, linkedin, scholar, order } = req.body;
    let photo = req.body.photo || null;

    if (req.file) {
      photo = await uploadFile(req.file.buffer, req.file.originalname, 'registrations', 'speakers');
    }

    const speaker = await prisma.speaker.create({
      data: {
        name, title, institution, country, type, bio,
        topics: Array.isArray(topics) ? topics : JSON.parse(topics || '[]'),
        photo, website: website || null, linkedin: linkedin || null, scholar: scholar || null,
        order: parseInt(order) || 0,
      },
    });
    res.status(201).json({ success: true, data: speaker });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const { name, title, institution, country, type, bio, topics, website, linkedin, scholar, order } = req.body;
    let photo = req.body.photo;

    if (req.file) {
      photo = await uploadFile(req.file.buffer, req.file.originalname, 'registrations', 'speakers');
    }

    const data = {
      name, title, institution, country, type, bio,
      topics: Array.isArray(topics) ? topics : JSON.parse(topics || '[]'),
      website: website || null, linkedin: linkedin || null, scholar: scholar || null,
      order: parseInt(order) || 0,
    };
    if (photo !== undefined) data.photo = photo;

    const speaker = await prisma.speaker.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: speaker });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    await prisma.speaker.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { next(e); }
};

module.exports = { getAll, create, update, remove };
