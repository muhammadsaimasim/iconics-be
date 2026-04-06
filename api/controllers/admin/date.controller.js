const prisma = require('../../../utils/prisma');

const getAll = async (_req, res, next) => {
  try {
    const dates = await prisma.importantDate.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: dates });
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const { date, title, description, order } = req.body;
    const record = await prisma.importantDate.create({
      data: { date, title, description, order: parseInt(order) || 0 },
    });
    res.status(201).json({ success: true, data: record });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const { date, title, description, order } = req.body;
    const record = await prisma.importantDate.update({
      where: { id: req.params.id },
      data: { date, title, description, order: parseInt(order) || 0 },
    });
    res.json({ success: true, data: record });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    await prisma.importantDate.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { next(e); }
};

module.exports = { getAll, create, update, remove };
