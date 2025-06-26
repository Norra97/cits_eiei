const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Addimg');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('Invalid file type'), false);
        } else {
            cb(null, true);
        }
    },
});

// Asset CRUD
router.get('/count', assetController.getAssetStatusSummary);
router.get('/', (req, res, next) => {
    if (req.query.status === 'available') {
        return assetController.getAvailableAssets(req, res);
    }
    return assetController.getAllAssets(req, res);
});
router.post('/', upload.single('Assetimg'), assetController.createAsset);
router.put('/:id', upload.single('Assetimg'), assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);
router.put('/toggle-status/:id', assetController.toggleStatus);

// Asset Type
router.get('/types', assetController.getAllAssetTypes);
router.post('/types', assetController.createAssetType);
router.put('/types/:id', assetController.updateAssetType);
router.delete('/types/:id', assetController.deleteAssetType);

// Unavailable dates
router.get('/unavailable-dates/:assetId', assetController.getUnavailableDates);

// Summary
router.get('/summary', assetController.getAssetStatusSummary);

module.exports = router; 