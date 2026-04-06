const { signAdminToken } = require('../../middlewares/auth.middleware');

const login = (req, res) => {
  const { secret } = req.body;
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const token = signAdminToken();
  res.json({ success: true, token });
};

module.exports = { login };
