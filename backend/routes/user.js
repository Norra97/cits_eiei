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
  console.log(`[CREATE USER] Admin: ${req.user.username}, NewUser: ${username}, Role: ${role}, Time: ${new Date().toISOString()}`);
  res.json({ id });
});
// Update user
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  await User.updateUser(req.params.id, req.body);
  console.log(`[UPDATE USER] Admin: ${req.user.username}, UserId: ${req.params.id}, Time: ${new Date().toISOString()}`);
  res.json({ message: 'updated' });
});
// Delete user
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  await User.deleteUser(req.params.id);
  console.log(`[DELETE USER] Admin: ${req.user.username}, UserId: ${req.params.id}, Time: ${new Date().toISOString()}`);
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
    console.log(`[CHANGE PASSWORD] UserId: ${req.user.id}, Username: ${req.user.username}, Time: ${new Date().toISOString()}`);
    res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 