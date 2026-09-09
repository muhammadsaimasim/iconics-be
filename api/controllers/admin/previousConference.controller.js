const prisma = require('../../../utils/prisma');

const getAll = async (_req, res, next) => {
  try {
    const data = await prisma.previousConferencePublication.findMany({ orderBy: { year: 'desc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const upsert = async (req, res, next) => {
  try {
    const { year } = req.params;
    const { journalUrl, isbn, issn } = req.body;
    const data = {
      journalUrl: journalUrl?.trim() || null,
      isbn: isbn?.trim() || null,
      issn: issn?.trim() || null,
    };
    const record = await prisma.previousConferencePublication.upsert({
      where: { year },
      update: data,
      create: { year, ...data },
    });
    res.json({ success: true, data: record });
  } catch (e) { next(e); }
};

module.exports = { getAll, upsert };
