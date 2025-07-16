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
  console.log(`[LOGIN] Username: ${user.username}, Role: ${user.role}, Time: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false })}`);
  res.json({ token, role: user.role, userId: user.userid, username: user.username });
});

router.post('/register', async (req, res) => {
  let { username, email, password, phone, department } = req.body;
  console.log('[REGISTER] Start', { username, email, phone, department, passwordPresent: !!password });
  if (!username || !email || !phone || !department) {
    console.log('[REGISTER] Missing required fields', { username, email, phone, department });
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }
  if (!password) password = '';
  const exist = await User.findByUsername(username);
  if (exist) {
    console.log('[REGISTER] Username exists', username);
    return res.status(400).json({ message: 'Username นี้ถูกใช้ไปแล้ว' });
  }
  try {
    console.log('[REGISTER] Before createUser');
    await User.createUser({
      username,
      password,
      role: 1, // user ทั่วไป
      phonenum: phone,
      department,
      useremail: email
    });
    console.log('[REGISTER] After createUser');
    // ดึง user กลับมาเพื่อสร้าง token
    const user = await User.findByUsername(username);
    const token = jwt.sign({ id: user.userid, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', token, role: user.role, userId: user.userid, username: user.username });
  } catch (err) {
    console.error('[REGISTER ERROR]', err.message, err.stack);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก', error: err.message });
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

// POST /api/auth/link-google
router.post('/link-google', async (req, res) => {
  const { google_id, email, student_code, picture } = req.body;
  if (!google_id || !student_code) return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  try {
    // ค้นหาจาก student code หรืออีเมลมหาลัย
    let [rows] = await require('../config/db').query(
      "SELECT * FROM user WHERE LEFT(useremail, LOCATE('@', useremail) - 1) = ? OR useremail = ?",
      [student_code, student_code]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'ไม่พบผู้ใช้ที่ตรงกับรหัสนักศึกษาหรืออีเมลนี้' });
    const user = rows[0];
    await require('../config/db').query('UPDATE user SET google_id = ?, picture = ? WHERE userid = ?', [google_id, picture, user.userid]);
    // สร้าง token ใหม่
    const token = jwt.sign({ id: user.userid, username: user.username, role: user.role, email: user.useremail, picture }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ message: 'ผูกบัญชีสำเร็จ', userId: user.userid, role: user.role, token });
  } catch (e) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: e.message });
  }
});

// POST /api/auth/unlink-google
router.post('/unlink-google', async (req, res) => {
  try {
    // Get user id from JWT
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.id;
    // Unlink Google account
    await require('../config/db').query('UPDATE user SET google_id = NULL, picture = NULL WHERE userid = ?', [userid]);
    res.json({ message: 'ยกเลิกผูกบัญชี Google สำเร็จ' });
  } catch (err) {
    console.error('Unlink Google error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยกเลิกผูกบัญชี Google' });
  }
});

module.exports = router; 