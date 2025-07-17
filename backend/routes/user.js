const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all users
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  const users = await User.getAllUsers();
  res.json(users);
});
// Create user
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { username, password, role, phonenum, department, useremail } = req.body;
  const id = await User.createUser({ username, password, role, phonenum, department, useremail });
  console.log(`[CREATE USER] Admin: ${req.user.username}, NewUser: ${username}, Role: ${role}, Time: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false })}`);
  res.json({ id });
});
// Update user (user แก้ไขตัวเอง หรือ admin แก้ไขใครก็ได้)
router.put('/:id', authenticateToken, async (req, res) => {
  // ถ้าไม่ใช่ admin และ id ไม่ตรงกับ req.user.id ให้ forbidden
  if (req.user.role !== 3 && String(req.user.id) !== String(req.params.id)) {
    return res.sendStatus(403);
  }
  await User.updateUser(req.params.id, req.body);
  console.log(`[UPDATE USER] Admin: ${req.user.username}, UserId: ${req.params.id}, Time: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false })}`);
  res.json({ message: 'updated' });
});
// PUT /api/users/me (user อัปเดตข้อมูลตัวเอง)
router.put('/me', authenticateToken, async (req, res) => {
  const { username, role, useremail, phonenum, department } = req.body;
  await User.updateUser(req.user.id, { username, role, useremail, phonenum, department });
  res.json({ message: 'updated' });
});
// Delete user
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  await User.deleteUser(req.params.id);
  console.log(`[DELETE USER] Admin: ${req.user.username}, UserId: ${req.params.id}, Time: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false })}`);
  res.json({ message: 'deleted' });
});

// Change password (self)
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }
  try {
    await User.changePassword(req.user.id, currentPassword, newPassword);
    console.log(`[CHANGE PASSWORD] UserId: ${req.user.id}, Username: ${req.user.username}, Time: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false })}`);
    res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Set password and update phone for new users (no current password required)
router.post('/set-password', authenticateToken, async (req, res) => {
  const { newPassword, phone } = req.body;
  if (!newPassword || !phone) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }
  const bcrypt = require('bcrypt');
  const hash = await bcrypt.hash(newPassword, 10);
  const pool = require('../config/db');
  await pool.query('UPDATE user SET password = ?, phonenum = ? WHERE userid = ?', [hash, phone, req.user.id]);
  res.json({ message: 'ตั้งรหัสผ่านสำเร็จ' });
});

// Check if user has password (for external email)
router.get('/:id/password-status', authenticateToken, async (req, res) => {
  const pool = require('../config/db');
  const [rows] = await pool.query('SELECT password FROM user WHERE userid = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ hasPassword: false });
  const pw = rows[0].password;
  res.json({ hasPassword: !!(pw && pw.length > 0) });
});

// Check if current user has password (for frontend Account button)
router.get('/has-password', authenticateToken, async (req, res) => {
  const pool = require('../config/db');
  const [rows] = await pool.query('SELECT password FROM user WHERE userid = ?', [req.user.id]);
  if (!rows.length) return res.json({ hasPassword: false });
  const pw = rows[0].password;
  res.json({ hasPassword: !!(pw && pw.length > 0) });
});

// Public register endpoint
router.post('/register', async (req, res) => {
  try {
    let { username, email, password, phone, department, google_id, picture } = req.body;
    // สำหรับ user เมลนอกมหาลัย: บังคับค่า default
    if (!department || department.trim() === '') department = 'external';
    if (!phone || phone.trim() === '') phone = 'external';
    password = '';
    const pool = require('../config/db');
    // Check for duplicate email
    const [rows] = await pool.query('SELECT * FROM user WHERE useremail = ?', [email]);
    if (rows.length > 0) return res.status(400).json({ message: 'อีเมลนี้ถูกใช้แล้ว' });
    // Create user (เพิ่ม google_id, picture ถ้ามี)
    const id = await User.createUser({ username, password, role: 1, phonenum: phone, department, useremail: email, google_id, picture });
    // สร้าง JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id, username, role: 1 }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ userId: id, token, role: 1 });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก', error: err.message });
  }
});

module.exports = router; 