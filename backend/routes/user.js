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
  res.json({ id });
});
// Update user
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  await User.updateUser(req.params.id, req.body);
  res.json({ message: 'updated' });
});
// Delete user
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  await User.deleteUser(req.params.id);
  res.json({ message: 'deleted' });
});

module.exports = router; 