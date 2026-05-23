const prisma = require('../../../utils/prisma');

const getAll = async (_req, res, next) => {
  try {
    const data = await prisma.committeeMember.findMany({
      orderBy: [{ order: 'asc' }],
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const { committeeName, name, role, institution, email, isChair, order } = req.body;
    const member = await prisma.committeeMember.create({
      data: {
        committeeName,
        name,
        role,
        institution: institution || null,
        email: email || null,
        isChair: isChair === true || isChair === 'true',
        order: parseInt(order) || 0,
      },
    });
    res.status(201).json({ success: true, data: member });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const { committeeName, name, role, institution, email, isChair, order } = req.body;
    const member = await prisma.committeeMember.update({
      where: { id: req.params.id },
      data: {
        committeeName,
        name,
        role,
        institution: institution || null,
        email: email || null,
        isChair: isChair === true || isChair === 'true',
        order: parseInt(order) || 0,
      },
    });
    res.json({ success: true, data: member });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    await prisma.committeeMember.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { next(e); }
};

module.exports = { getAll, create, update, remove };
