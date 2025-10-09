const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Validate JWT token
router.post('/validate', (req, res) => {
  const token = req.body.token || req.headers['authorization'];
  if (!token) return res.status(401).json({ valid: false, msg: 'No token provided.' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded.user });
  } catch (err) {
    res.status(401).json({ valid: false, msg: 'Invalid or expired token.' });
  }
});

module.exports = router;
