const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByUsername(username);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.userid, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, role: user.role, userId: user.userid, username: user.username });
});

module.exports = router; 