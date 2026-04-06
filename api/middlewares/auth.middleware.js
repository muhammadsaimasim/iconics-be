const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'iconics_admin_secret_change_in_prod';

/**
 * Verify JWT token on admin routes.
 */
const verifyAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Generate a signed JWT for the admin session.
 */
const signAdminToken = () => {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
};

module.exports = { verifyAdmin, signAdminToken };
