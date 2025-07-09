const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all equipment
router.get('/', authenticateToken, async (req, res) => {
  const items = await Equipment.getAll();
  res.json(items);
});
// Create equipment
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const id = await Equipment.create(req.body);
  res.json({ id });
});
// Update equipment
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  await Equipment.update(req.params.id, req.body);
  res.json({ message: 'updated' });
});
// Delete equipment
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  await Equipment.delete(req.params.id);
  res.json({ message: 'deleted' });
});

module.exports = router; 