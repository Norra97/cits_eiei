const assetService = require('../services/asset.service');

exports.getAllAssets = async (req, res) => {
    try {
        const assets = await assetService.getAllAssets();
        res.json(assets);
    } catch (err) {
        res.status(500).send(err.message || 'Internal server error');
    }
};

exports.createAsset = async (req, res) => {
    try {
        const asset = req.body;
        if (req.file) asset.Assetimg = req.file.filename;
        const result = await assetService.createAsset(asset);
        res.status(201).json({ success: true, insertId: result.insertId });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
    }
};

exports.updateAsset = async (req, res) => {
    try {
        const id = req.params.id;
        const { Assetname, Assetdetail, Assetcode, Assetlocation, Assettype } = req.body;
        const Assetimg = req.file ? req.file.filename : null;
        const fields = [];
        const values = [];
        if (Assetname) { fields.push('Assetname = ?'); values.push(Assetname); }
        if (Assetdetail) { fields.push('Assetdetail = ?'); values.push(Assetdetail); }
        if (Assetcode) { fields.push('Assetcode = ?'); values.push(Assetcode); }
        if (Assetlocation) { fields.push('Assetlocation = ?'); values.push(Assetlocation); }
        if (Assettype) { fields.push('Assettype = ?'); values.push(Assettype); }
        if (Assetimg) { fields.push('Assetimg = ?'); values.push(Assetimg); }
        if (fields.length === 0) return res.status(400).send('No fields to update');
        const result = await assetService.updateAsset(id, fields, values);
        if (result.affectedRows === 0) return res.status(404).send('Asset not found!');
        res.status(200).json({ success: true, message: 'Asset updated successfully!' });
    } catch (err) {
        res.status(500).send(err.message || 'Internal server error');
    }
};

exports.deleteAsset = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await assetService.deleteAsset(id);
        if (result.affectedRows === 0) return res.status(404).send('No asset found with given ID!!');
        res.status(200).json({ success: true, message: 'Asset deleted successfully' });
    } catch (err) {
        res.status(500).send(err.message || 'Internal server error');
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { newStatus } = req.body;
        await assetService.toggleStatus(id, newStatus);
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message || 'Internal server error');
    }
};

exports.getUnavailableDates = async (req, res) => {
    try {
        const assetId = req.params.assetId;
        const unavailableDates = await assetService.getUnavailableDates(assetId);
        res.json(unavailableDates);
    } catch (err) {
        res.status(500).send(err.message || 'Internal server error');
    }
};

// Asset Type
exports.getAllAssetTypes = async (req, res) => {
    try {
        const types = await assetService.getAllAssetTypes();
        res.json(types);
    } catch (err) {
        res.status(500).send(err.message || 'Internal server error');
    }
};

exports.createAssetType = async (req, res) => {
    try {
        const { asset_type_name } = req.body;
        if (!asset_type_name) return res.status(400).send('Asset type name is required');
        const result = await assetService.createAssetType(asset_type_name);
        res.status(201).json({ success: true, id: result.insertId, name: asset_type_name });
    } catch (err) {
        res.status(500).send(err.message || 'Internal server error');
    }
};

exports.updateAssetType = async (req, res) => {
    try {
        const { id } = req.params;
        const { asset_type_name } = req.body;
        await assetService.updateAssetType(id, asset_type_name);
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message || 'Internal server error');
    }
};

exports.deleteAssetType = async (req, res) => {
    try {
        const { id } = req.params;
        await assetService.deleteAssetType(id);
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message || 'Internal server error');
    }
};

exports.getAssetCount = async (req, res) => {
    try {
        const count = await assetService.getAssetCount();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAvailableAssets = async (req, res) => {
    try {
        const assets = await assetService.getAvailableAssets();
        res.json(assets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAssetStatusSummary = async (req, res) => {
    try {
        const summary = await assetService.getAssetCounts();
        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 