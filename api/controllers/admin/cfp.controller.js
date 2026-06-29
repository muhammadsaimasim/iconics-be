const path = require('path');
const fs = require('fs');
const prisma = require('../../../utils/prisma');

const CFP_DIR = path.join(__dirname, '../../../uploads/cfp');

function saveFileToDisk(buffer, originalName) {
  if (!fs.existsSync(CFP_DIR)) fs.mkdirSync(CFP_DIR, { recursive: true });
  const ext = path.extname(originalName);
  const safeName = `${Date.now()}${ext}`;
  fs.writeFileSync(path.join(CFP_DIR, safeName), buffer);
  return `/uploads/cfp/${safeName}`;
}

const upsertCfpAssets = async (req, res, next) => {
  try {
    const updates = [];

    if (req.files?.poster?.[0]) {
      const file = req.files.poster[0];
      const url = saveFileToDisk(file.buffer, file.originalname);
      updates.push({ key: 'cfp_poster_url', value: url });
    }

    if (req.files?.authorGuidelines?.[0]) {
      const file = req.files.authorGuidelines[0];
      const url = saveFileToDisk(file.buffer, file.originalname);
      updates.push({ key: 'cfp_author_guidelines_url', value: url });
    }

    if (req.files?.reviewerGuidelines?.[0]) {
      const file = req.files.reviewerGuidelines[0];
      const url = saveFileToDisk(file.buffer, file.originalname);
      updates.push({ key: 'cfp_reviewer_guidelines_url', value: url });
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided.' });
    }

    await Promise.all(updates.map(({ key, value }) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    ));

    res.json({ success: true });
  } catch (e) { next(e); }
};

module.exports = { upsertCfpAssets };
