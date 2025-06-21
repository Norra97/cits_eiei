const assetModel = require('../models/asset.model');

exports.getAllAssets = async () => {
    return await assetModel.getAllAssets();
};

exports.createAsset = async (asset) => {
    // ตรวจสอบ asset type
    const typeExists = await assetModel.checkAssetTypeExists(asset.Assettype);
    if (typeExists.length === 0) {
        throw { status: 400, message: 'Invalid asset type' };
    }
    return await assetModel.createAsset(asset);
};

exports.updateAsset = async (id, fields, values) => {
    return await assetModel.updateAsset(id, fields, values);
};

exports.deleteAsset = async (id) => {
    return await assetModel.deleteAsset(id);
};

exports.toggleStatus = async (id, newStatus) => {
    return await assetModel.toggleStatus(id, newStatus);
};

exports.getUnavailableDates = async (assetId) => {
    const results = await assetModel.getUnavailableDates(assetId);
    // สร้าง array ของวันที่ที่ไม่สามารถยืมได้
    const unavailableDates = [];
    results.forEach(row => {
        let currentDate = new Date(row.Borrowdate);
        const endDate = new Date(row.ReturnDate);
        while (currentDate <= endDate) {
            unavailableDates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });
    return unavailableDates;
};

// Asset Type
exports.getAllAssetTypes = async () => {
    return await assetModel.getAllAssetTypes();
};

exports.createAssetType = async (name) => {
    return await assetModel.createAssetType(name);
};

exports.updateAssetType = async (id, name) => {
    return await assetModel.updateAssetType(id, name);
};

exports.deleteAssetType = async (id) => {
    return await assetModel.deleteAssetType(id);
};

exports.getAssetCounts = async () => {
    return await assetModel.getAssetCounts();
};

exports.getAssetCount = async () => {
    return await assetModel.getAssetCount();
};

exports.getAvailableAssets = async () => {
    return await assetModel.getAvailableAssets();
};

exports.getAssetStatusSummary = async () => {
    return await assetModel.getAssetStatusSummary();
}; 