const bcrypt = require('bcryptjs');
const prisma = require('../../../utils/prisma');
const { signAdminToken } = require('../../middlewares/auth.middleware');

// Compared against when the email is unknown, so response time doesn't reveal
// which admin emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password || password.length > 200) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const admin = await prisma.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
    const ok = await bcrypt.compare(password, admin?.passwordHash || DUMMY_HASH);
    if (!admin || !ok || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    console.log(`Admin login: ${admin.email} from ${req.ip}`);

    res.json({ success: true, token: signAdminToken(admin), admin: { email: admin.email, name: admin.name } });
  } catch (e) { next(e); }
};

// Invalidate every outstanding token for the current admin (all devices).
const logoutAll = async (req, res, next) => {
  try {
    await prisma.admin.update({
      where: { id: req.admin.id },
      data: { tokenVersion: { increment: 1 } },
    });
    res.json({ success: true });
  } catch (e) { next(e); }
};

module.exports = { login, logoutAll };
