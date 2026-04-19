const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak disertakan.' });
  }

  const token = header.slice(7).trim();
  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak disertakan.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa.' });
  }
};

module.exports = authMiddleware;
