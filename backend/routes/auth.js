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

router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'กรุณากรอก username' });
  try {
    // Use findByStudentCode instead of findByUsername
    const user = await User.findByStudentCode(username);
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้ในระบบ' });
    }
    // ส่ง userid และข้อมูลที่จำเป็นกลับไป
    return res.json({ userid: user.userid, username: user.username, useremail: user.useremail });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'ไม่สามารถส่งคำขอได้' });
  }
});

router.post('/reset-password/:userid', async (req, res) => {
  const { userid } = req.params;
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ message: 'กรุณากรอกรหัสผ่านใหม่' });
  // Password policy: 8-16, at least 1 upper, 1 lower, 1 digit, no special chars
  const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
  if (!policy.test(newPassword)) {
    return res.status(400).json({ message: 'รหัสผ่านไม่ตรงตามเงื่อนไข' });
  }
  try {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(newPassword, 10);
    const pool = require('../config/db');
    await pool.query('UPDATE user SET password = ? WHERE userid = ?', [hash, userid]);
    res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'ไม่สามารถเปลี่ยนรหัสผ่านได้' });
  }
});

module.exports = router; 