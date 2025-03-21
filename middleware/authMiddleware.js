// authMiddleware.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Asumimos formato: "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: user._id, role: user.role, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid or expired.' });
  }
}

function verifyAdmin(req, res, next) {
  // Llamamos primero a verifyToken
  verifyToken(req, res, function() {
    // Ya tenemos req.user
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  });
}

module.exports = { verifyToken, verifyAdmin };
