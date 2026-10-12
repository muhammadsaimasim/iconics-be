const jwt = require('jsonwebtoken');
const prisma = require('../../utils/prisma');

// Fail closed: never fall back to a built-in secret. A guessable secret lets
// anyone forge an admin token.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to a random string of at least 32 characters.');
}

const TOKEN_TTL = '8h';

/**
 * Verify JWT token on admin routes. The admin must still exist and be active,
 * so disabling an account revokes its sessions immediately.
 */
const verifyAdmin = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const token = auth.slice(7);
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, isActive: true, tokenVersion: true },
    });
    if (!admin || !admin.isActive || admin.tokenVersion !== payload.ver) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    req.admin = { id: admin.id, email: admin.email };
    next();
  } catch (e) { next(e); }
};

/**
 * Generate a signed JWT for an admin session.
 */
const signAdminToken = (admin) => {
  return jwt.sign(
    { sub: admin.id, ver: admin.tokenVersion, role: 'admin' },
    JWT_SECRET,
    { algorithm: 'HS256', expiresIn: TOKEN_TTL },
  );
};

module.exports = { verifyAdmin, signAdminToken };
