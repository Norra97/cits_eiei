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

router.post('/register', async (req, res) => {
  const { username, email, password, phone, department } = req.body;
  if (!username || !email || !password || !phone || !department) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }
  const exist = await User.findByUsername(username);
  if (exist) {
    return res.status(400).json({ message: 'Username นี้ถูกใช้ไปแล้ว' });
  }
  try {
    await User.createUser({
      username,
      password,
      role: 1, // user ทั่วไป
      phonenum: phone,
      department,
      useremail: email
    });
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
  }
});

module.exports = router; 