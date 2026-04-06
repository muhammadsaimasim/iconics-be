const prisma = require('../../../utils/prisma');

const getAll = async (_req, res, next) => {
  try {
    const tracks = await prisma.track.findMany({
      orderBy: { order: 'asc' },
      include: { topics: { orderBy: { order: 'asc' } } },
    });
    res.json({ success: true, data: tracks });
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const { name, icon, order } = req.body;
    const track = await prisma.track.create({
      data: { name, icon, order: parseInt(order) || 0 },
      include: { topics: true },
    });
    res.status(201).json({ success: true, data: track });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const { name, icon, order } = req.body;
    const track = await prisma.track.update({
      where: { id: req.params.id },
      data: { name, icon, order: parseInt(order) || 0 },
      include: { topics: { orderBy: { order: 'asc' } } },
    });
    res.json({ success: true, data: track });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    await prisma.track.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { next(e); }
};

const addTopic = async (req, res, next) => {
  try {
    const { name, order } = req.body;
    const topic = await prisma.trackTopic.create({
      data: { trackId: req.params.trackId, name, order: parseInt(order) || 0 },
    });
    res.status(201).json({ success: true, data: topic });
  } catch (e) { next(e); }
};

const updateTopic = async (req, res, next) => {
  try {
    const { name, order } = req.body;
    const topic = await prisma.trackTopic.update({
      where: { id: req.params.topicId },
      data: { name, order: parseInt(order) || 0 },
    });
    res.json({ success: true, data: topic });
  } catch (e) { next(e); }
};

const removeTopic = async (req, res, next) => {
  try {
    await prisma.trackTopic.delete({ where: { id: req.params.topicId } });
    res.json({ success: true });
  } catch (e) { next(e); }
};

module.exports = { getAll, create, update, remove, addTopic, updateTopic, removeTopic };
