const db = require('../config/db');

exports.getAllAssets = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM Asset WHERE Assetstatus IN ('Available', 'Disabled')", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.createAsset = (asset) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO asset (Assetname, Assetdetail, Assetcode, Assetlocation, Assetimg, Staffaddid, Assetstatus, Assettype) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [asset.Assetname, asset.Assetdetail, asset.Assetcode, asset.Assetlocation, asset.Assetimg, asset.Staffaddid, asset.Assetstatus, asset.Assettype], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.updateAsset = (id, fields, values) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Asset SET ${fields.join(", ")} WHERE Assetid = ?`;
        db.query(sql, [...values, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.deleteAsset = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM Asset WHERE Assetid = ?", [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.toggleStatus = (id, newStatus) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE Asset SET Assetstatus = ? WHERE Assetid = ?", [newStatus, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.getUnavailableDates = (assetId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT Borrowdate, ReturnDate FROM BorrowReq WHERE Assetid = ? AND Status IN ('Pending', 'Approved', 'Borrowing')`;
        db.query(query, [assetId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Asset Type
exports.getAllAssetTypes = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM asset_type", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.createAssetType = (name) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO asset_type (asset_type_name) VALUES (?)", [name], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.updateAssetType = (id, name) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE asset_type SET asset_type_name = ? WHERE asset_type_id = ?", [name, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.deleteAssetType = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM asset_type WHERE asset_type_id = ?", [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.checkAssetTypeExists = (name) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT asset_type_name FROM asset_type WHERE asset_type_name = ?", [name], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getAssetCount = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM Asset', (err, results) => {
            if (err) return reject(err);
            resolve(results[0].count);
        });
    });
};

exports.getAvailableAssets = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM Asset WHERE Assetstatus = 'Available'", (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getAssetStatusSummary = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT Assetstatus, COUNT(*) as count FROM Asset GROUP BY Assetstatus`,
            (err, results) => {
                if (err) return reject(err);
                const summary = {};
                results.forEach(row => {
                    summary[row.Assetstatus] = row.count;
                });
                resolve(summary);
            }
        );
    });
};

exports.getAssetCounts = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                (SELECT COUNT(*) FROM Asset WHERE Assetstatus = 'Available') as available,
                (SELECT COUNT(*) FROM BorrowReq WHERE Status = 'Approved') as borrowing,
                (SELECT COUNT(*) FROM Asset WHERE Assetstatus = 'Disabled') as disabled,
                (SELECT COUNT(*) FROM BorrowReq WHERE Status = 'Pending') as pending;
        `;
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
}; 