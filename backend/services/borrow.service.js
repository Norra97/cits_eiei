const borrowModel = require('../models/borrow.model');

exports.borrowAsset = async (assetId, borrowDate, returnDate, username, activity, usageType) => {
    const isOverlap = await borrowModel.checkDateOverlap(assetId, borrowDate, returnDate);
    if (isOverlap) {
        throw { status: 400, message: 'Date range overlaps with an active borrow request for the same asset.' };
    }
    return await borrowModel.insertBorrowRequest(assetId, borrowDate, returnDate, username, activity, usageType);
};

exports.updateAssetStatus = async (assetId, status) => {
    return await borrowModel.updateAssetStatus(assetId, status);
};

exports.returnAsset = async (reqId, newStatus) => {
    return await borrowModel.returnAsset(reqId, newStatus);
};

exports.getRequestsByStatus = async (status, username) => {
    return await borrowModel.getRequestsByStatus(status, username);
};

exports.getDashboardSummary = async () => {
    const [pending, repending, approve, reject, returned] = await Promise.all([
        borrowModel.countByStatus('Pending'),
        borrowModel.countByStatus('RePending'),
        borrowModel.countByStatus('Approved'),
        borrowModel.countByStatus('Reject'),
        borrowModel.countByStatus('Returned')
    ]);
    return { pending, repending, approve, reject, return: returned };
};

exports.approveBorrowRequest = async (reqId, lecturerName) => {
    return await borrowModel.approveBorrowRequest(reqId, lecturerName);
};

exports.rejectBorrowRequest = async (requestId, lectname, rejectReason) => {
    return await borrowModel.rejectBorrowRequest(requestId, lectname, rejectReason);
}; 