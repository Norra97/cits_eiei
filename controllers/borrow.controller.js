const borrowService = require('../services/borrow.service');
const { Parser } = require('json2csv');

exports.borrowAsset = async (req, res) => {
    try {
        const { assetId, borrowDate, returnDate, username, activity, usageType } = req.body;
        await borrowService.borrowAsset(assetId, borrowDate, returnDate, username, activity, usageType);
        res.status(201).json({ success: true, message: 'Borrow request added successfully.' });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
    }
};

exports.updateAssetStatus = async (req, res) => {
    try {
        const assetId = req.params.assetId;
        const { status } = req.body;
        await borrowService.updateAssetStatus(assetId, status);
        res.status(200).json({ success: true, message: `Asset status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
};

exports.returnAsset = async (req, res) => {
    const reqId = req.params.reqId;
    const { newStatus } = req.body;
    console.log('[DEBUG] returnAsset reqId:', reqId, 'newStatus:', newStatus);
    try {
        await borrowService.returnAsset(reqId, newStatus);
        res.json({ success: true, message: 'อัพเดทสถานะการคืนเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('[DEBUG] returnAsset error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด: ' + error.message });
    }
};

exports.getRequestsByStatus = async (req, res) => {
    const { status, username } = req.query;
    try {
        if (status === 'dashboard') {
            const summary = await borrowService.getDashboardSummary();
            return res.json(summary);
        }
        const results = await borrowService.getRequestsByStatus(status, username);
        res.json(results);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

exports.approveBorrowRequest = async (req, res) => {
    try {
        const reqId = req.params.reqId;
        const { lecturerName } = req.body;
        await borrowService.approveBorrowRequest(reqId, lecturerName);
        res.json({ success: true, message: 'Borrow request approved successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to approve borrow request.' });
    }
};

exports.rejectBorrowRequest = async (req, res) => {
    try {
        const { requestId, lectname, rejectReason } = req.body;
        await borrowService.rejectBorrowRequest(requestId, lectname, rejectReason);
        res.json({ success: true, message: 'Borrow request rejected successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to reject borrow request.' });
    }
};

exports.getAllHistory = async (req, res) => {
    try {
        const results = await require('../models/borrow.model').getAllHistory();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch history' });
    }
};

exports.exportHistoryCSV = async (req, res) => {
    try {
        const results = await require('../models/borrow.model').getAllHistory();
        // Define fields to match the table columns
        const fields = [
            { label: 'Asset ID', value: 'Assetid' },
            { label: 'Image', value: 'Assetimg' },
            { label: 'Asset Name', value: 'Assetname' },
            { label: 'Status', value: 'Assetstatus' },
            { label: 'Staff ID', value: 'Staffaddid' },
            { label: 'Asset Code', value: 'Assetcode' },
            { label: 'Location', value: 'Assetlocation' },
            { label: 'Borrow Date', value: 'Borrowdate' },
            { label: 'Return Date', value: 'ReturnDate' },
            { label: 'Admin approve', value: 'lectname' },
            { label: 'Borrower', value: 'Borrowname' },
            { label: 'Borrow Status', value: 'Status' },
            { label: 'Comment', value: 'Comment' }
        ];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(results);
        res.header('Content-Type', 'text/csv');
        res.attachment('borrowing_history.csv');
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to export CSV' });
    }
}; 