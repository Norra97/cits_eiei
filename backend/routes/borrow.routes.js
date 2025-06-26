const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrow.controller');

// Borrow asset
router.post('/borrow-asset', borrowController.borrowAsset);
// Update asset status
router.put('/update-asset-status/:assetId', borrowController.updateAssetStatus);
// Return asset
router.put('/return-asset/:reqId', borrowController.returnAsset);
// Get requests by status (status=[disabled,return,pending,reject,repending,returned])
router.get('/requests', borrowController.getRequestsByStatus);
// Approve borrow request
router.put('/approve-borrow-request/:reqId', borrowController.approveBorrowRequest);
// Reject borrow request
router.post('/reject-borrow-request', borrowController.rejectBorrowRequest);

module.exports = router; 