const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all equipment
router.get('/', authenticateToken, async (req, res) => {
  const items = await Equipment.getAll();
  res.json(items);
});
// Create equipment (with image upload)
router.post('/', authenticateToken, isAdmin, upload.single('Assetimg'), async (req, res) => {
  const body = req.body;
  try {
    const id = await Equipment.create({
      Assetname: body.Assetname || '',
      Assetdetail: body.Assetdetail || '',
      Assetcode: body.Assetcode || '',
      Assetlocation: body.Assetlocation || 'MFU',
      Assetimg: req.file ? req.file.filename : '',
      Staffaddid: req.user.id, // ใช้ id ของ admin ที่ login
      Assetstatus: body.Assetstatus || 'Available',
      Assettype: body.Assettype || ''
    });
    console.log(`[CREATE EQUIPMENT] Admin: ${req.user.username}, Assetname: ${body.Assetname}, Assetcode: ${body.Assetcode}, Time: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false })}`);
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
      console.log(`[BULK CREATE EQUIPMENT] Admin: ${req.user.username}, Assetname: ${item.Assetname}, Assetcode: ${item.Assetcode}, Time: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: false })}`);
    }
    res.json({ message: 'Bulk insert success' });
  } catch (e) {
    console.error('Bulk insert error:', e);
    res.status(500).json({ message: 'Bulk insert failed', error: e.message });
  }
});
// Update equipment
router.put('/:id', authenticateToken, isAdmin, upload.single('Assetimg'), async (req, res) => {
  const updateData = req.body;
  if (req.file) {
    updateData.Assetimg = req.file.filename;
  }
  await Equipment.update(req.params.id, updateData);
  res.json({ message: 'updated' });
});
// Delete equipment
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  await Equipment.delete(req.params.id);
  res.json({ message: 'deleted' });
});

// Get all asset types
router.get('/types', authenticateToken, async (req, res) => {
  try {
    const types = await Equipment.getAllTypes();
    res.json(types);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch types', error: e.message });
  }
});

// Get all asset types from asset_type table
router.get('/asset-types', authenticateToken, async (req, res) => {
  try {
    const types = await Equipment.getAllAssetTypes();
    res.json(types);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch asset types', error: e.message });
  }
});

// เพิ่มประเภทใหม่
router.post('/asset-types', authenticateToken, isAdmin, async (req, res) => {
  const { asset_type_name } = req.body;
  if (!asset_type_name) return res.status(400).json({ message: 'asset_type_name is required' });
  try {
    const newType = await Equipment.createAssetType(asset_type_name);
    res.json(newType);
  } catch (e) {
    res.status(500).json({ message: 'Failed to add asset type', error: e.message });
  }
});

// Get all asset locations
router.get('/locations', authenticateToken, async (req, res) => {
  try {
    const locations = await Equipment.getAllLocations();
    res.json(locations);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch locations', error: e.message });
  }
});

// Get all asset statuses
router.get('/statuses', authenticateToken, async (req, res) => {
  try {
    const statuses = await Equipment.getAllStatuses();
    res.json(statuses);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch statuses', error: e.message });
  }
});

module.exports = router; 