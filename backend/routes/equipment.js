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
  const body = req.body;
  try {
    const id = await Equipment.create({
      Assetname: body.Assetname || '',
      Assetdetail: body.Assetdetail || '',
      Assetcode: body.Assetcode || '',
      Assetlocation: body.Assetlocation || 'MFU',
      Assetimg: body.Assetimg || '',
      Staffaddid: req.user.id, // ใช้ id ของ admin ที่ login
      Assetstatus: body.Assetstatus || 'Available',
      Assettype: body.Assettype || ''
    });
    res.json({ id });
  } catch (e) {
    res.status(500).json({ message: 'Create failed', error: e.message });
  }
});
// Bulk insert equipment
router.post('/bulk', authenticateToken, isAdmin, async (req, res) => {
  const items = req.body.items;
  if (!Array.isArray(items)) return res.status(400).json({ message: 'Invalid data' });
  try {
    for (const item of items) {
      await Equipment.create({
        Assetname: item.Assetname || '',
        Assetdetail: item.Assetdetail || '',
        Assetcode: item.Assetcode || '',
        Assetlocation: item.Assetlocation || 'MFU',
        Assetimg: item.Assetimg || '',
        Staffaddid: req.user.id, // ใช้ id ของ admin ที่ login
        Assetstatus: item.Assetstatus || 'Available',
        Assettype: item.Assettype || ''
      });
    }
    res.json({ message: 'Bulk insert success' });
  } catch (e) {
    console.error('Bulk insert error:', e);
    res.status(500).json({ message: 'Bulk insert failed', error: e.message });
  }
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