const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('[AUTH] NO TOKEN');
    return res.sendStatus(401);
  }
  require('jsonwebtoken').verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('[AUTH] JWT VERIFY ERROR:', err);
      return res.sendStatus(403);
    }
    console.log('[AUTH] JWT PAYLOAD:', user);
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== 3) return res.sendStatus(403);
  next();
}
function isStaff(req, res, next) {
  if (req.user.role !== 2) return res.sendStatus(403);
  next();
}
function isUser(req, res, next) {
  if (req.user.role !== 1) return res.sendStatus(403);
  next();
}

module.exports = { authenticateToken, isAdmin, isStaff, isUser }; 