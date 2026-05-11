const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getModels } = require('./models/index');

const SECRET = process.env.JWT_SECRET || 'ef_secret_change_me';
const EXPIRES = process.env.JWT_EXPIRES || '7d';

function genToken(user) {
  return jwt.sign({ id: user._id.toString(), email: user.email, role: user.role, name: user.name }, SECRET, { expiresIn: EXPIRES });
}

async function auth(req, res, next) {
  const hdr = req.headers.authorization;
  if (!hdr || !hdr.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  try {
    const dec = jwt.verify(hdr.slice(7), SECRET);
    const { User } = getModels();
    const user = await User.findById(dec.id);
    if (!user || !user.isActive) return res.status(401).json({ error: 'User not found or deactivated' });
    req.user = user;
    next();
  } catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

async function audit(models, userId, userName, event, ip, status='success') {
  try { await models.AuditLog.create({ userId, userName, event, ipAddress: ip||'0.0.0.0', status }); } catch {}
}

module.exports = { genToken, auth, adminOnly, audit };
