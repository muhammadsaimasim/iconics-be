const prisma = require('../../../utils/prisma');

const DEFAULT_SETTINGS = {
  speakers_active: 'true',
  schedule_active: 'true',
};

const getAll = async (_req, res, next) => {
  try {
    const rows = await prisma.siteSetting.findMany();
    const settings = { ...DEFAULT_SETTINGS };
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json({ success: true, data: settings });
  } catch (e) { next(e); }
};

const upsert = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
    res.json({ success: true, data: setting });
  } catch (e) { next(e); }
};

module.exports = { getAll, upsert };
