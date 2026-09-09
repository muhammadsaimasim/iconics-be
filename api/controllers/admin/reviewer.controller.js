const prisma = require('../../../utils/prisma');
const { uploadFile } = require('../../../utils/supabase');

const getAll = async (_req, res, next) => {
  try { res.json({ success: true, data: await prisma.reviewer.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] }) }); }
  catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const { name, email, from, isNed, order } = req.body;
    const photo = req.file ? await uploadFile(req.file.buffer, req.file.originalname, 'registerations', 'reviewers') : null;
    const data = await prisma.reviewer.create({ data: { name, email: email?.trim() || null, from: from?.trim() || null, isNed: isNed === true || isNed === 'true', photo, order: parseInt(order) || 0 } });
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const { name, email, from, isNed, order } = req.body;
    const data = { name, email: email?.trim() || null, from: from?.trim() || null, isNed: isNed === true || isNed === 'true', order: parseInt(order) || 0 };
    if (req.file) data.photo = await uploadFile(req.file.buffer, req.file.originalname, 'registerations', 'reviewers');
    const reviewer = await prisma.reviewer.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: reviewer });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try { await prisma.reviewer.delete({ where: { id: req.params.id } }); res.json({ success: true }); }
  catch (e) { next(e); }
};

module.exports = { getAll, create, update, remove };
