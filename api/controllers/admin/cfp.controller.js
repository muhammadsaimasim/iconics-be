const prisma = require('../../../utils/prisma');

const upsertCfpAssets = async (req, res, next) => {
  try {
    const updates = [];

    if (req.files?.poster?.[0]) {
      updates.push({ key: 'cfp_poster_url', value: `/uploads/cfp/${req.files.poster[0].filename}` });
    }

    if (req.files?.authorGuidelines?.[0]) {
      updates.push({ key: 'cfp_author_guidelines_url', value: `/uploads/cfp/${req.files.authorGuidelines[0].filename}` });
    }

    if (req.files?.reviewerGuidelines?.[0]) {
      updates.push({ key: 'cfp_reviewer_guidelines_url', value: `/uploads/cfp/${req.files.reviewerGuidelines[0].filename}` });
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
