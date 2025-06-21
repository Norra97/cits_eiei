const db = require('../config/db');

exports.insertBorrowRequest = (assetId, borrowDate, returnDate, username, activity, usageType) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO BorrowReq (Assetid, Borrowdate, Returndate, Status, Borrowname, Activity, UsageType) VALUES (?, ?, ?, 'Pending', ?, ?, ?)`;
        db.query(sql, [assetId, borrowDate, returnDate, username, activity, usageType], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.checkDateOverlap = (assetId, borrowDate, returnDate) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM BorrowReq WHERE AssetId = ? AND Status IN ('Borrowing', 'Approved') AND (BorrowDate <= ? AND ReturnDate >= ?)`;
        db.query(sql, [assetId, returnDate, borrowDate], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0);
        });
    });
};

exports.updateAssetStatus = (assetId, status) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Asset SET Assetstatus = ? WHERE Assetid = ?`;
        db.query(sql, [status, assetId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.returnAsset = async (reqId, newStatus) => {
    const pool = db.promise();
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [assetResult] = await connection.query('SELECT Assetid FROM BorrowReq WHERE Reqid = ?', [reqId]);
        if (assetResult.length === 0) throw new Error('ไม่พบคำขอยืม');
        const assetId = assetResult[0].Assetid;
        const [borrowUpdateResult] = await connection.query('UPDATE BorrowReq SET Status = ? WHERE Reqid = ?', [newStatus, reqId]);
        if (borrowUpdateResult.affectedRows === 0) throw new Error('ไม่สามารถอัพเดทสถานะคำขอยืมได้');
        const [assetUpdateResult] = await connection.query('UPDATE Asset SET Assetstatus = "Available" WHERE Assetid = ?', [assetId]);
        if (assetUpdateResult.affectedRows === 0) throw new Error('ไม่สามารถอัพเดทสถานะอุปกรณ์ได้');
        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.getRequestsByStatus = (status, username) => {
    return new Promise((resolve, reject) => {
        let sql = '';
        let params = [];
        if (status === 'pending') {
            sql = `
                SELECT br.*, a.Assetname, a.Assetimg
                FROM BorrowReq br
                LEFT JOIN Asset a ON br.Assetid = a.Assetid
                WHERE br.Status = 'Pending'
            `;
        } else if (status === 'all') {
            sql = `
                SELECT br.*, a.Assetname, a.Assetimg
                FROM BorrowReq br
                LEFT JOIN Asset a ON br.Assetid = a.Assetid
                ORDER BY br.Borrowdate DESC
            `;
        } else if (status === 'Approved') {
            sql = `
                SELECT br.*, a.Assetname, a.Assetimg
                FROM BorrowReq br
                LEFT JOIN Asset a ON br.Assetid = a.Assetid
                WHERE br.Status = 'Approved'
                ORDER BY br.Borrowdate DESC
            `;
        } else if (status === 'Returned') {
            sql = `
                SELECT br.*, a.Assetname, a.Assetimg
                FROM BorrowReq br
                LEFT JOIN Asset a ON br.Assetid = a.Assetid
                WHERE br.Status = 'Returned'
                ORDER BY br.Borrowdate DESC
            `;
        } else if (status === 'disabled') {
            sql = `SELECT a.Assetid,a.Assetimg,a.Assetname,br.Status, br.comment FROM Asset a LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid WHERE br.Status = 'Reject' AND br.Borrowname = ?`;
            params = [username];
        } else if (status === 'return') {
            sql = `SELECT a.*,br.* FROM Asset a LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid WHERE br.Status = 'Approved' AND br.Borrowname = ?`;
            params = [username];
        } else if (status === 'reject') {
            sql = `SELECT a.*,br.* FROM Asset a LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid WHERE br.Status = 'Reject' AND br.Borrowname = ?`;
            params = [username];
        } else if (status === 'repending') {
            if (username) {
                sql = `SELECT a.*,br.* FROM Asset a LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid WHERE br.Status = 'RePending' AND br.Borrowname = ?`;
                params = [username];
            } else {
                sql = `SELECT a.*,br.* FROM Asset a LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid WHERE br.Status = 'RePending'`;
            }
        } else if (status === 'returned') {
            sql = `SELECT a.*,br.* FROM Asset a LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid WHERE br.Status = 'Returned' AND br.Borrowname = ?`;
            params = [username];
        } else if (status === 'borrow') {
            sql = `
                SELECT br.*, a.Assetname, a.Assetimg, a.Assetcode, a.Assetdetail, a.Assetlocation
                FROM BorrowReq br
                LEFT JOIN Asset a ON br.Assetid = a.Assetid
                WHERE br.Status = 'Approved' AND br.Borrowname = ?
            `;
            params = [username];
        }
        db.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.countByStatus = (status) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) as count FROM BorrowReq WHERE Status = ?', [status], (err, results) => {
            if (err) return reject(err);
            resolve(results[0].count);
        });
    });
};

exports.approveBorrowRequest = (reqId, lecturerName) => {
    return new Promise((resolve, reject) => {
        // อัปเดตทั้ง Status และ lectname
        const sql = `UPDATE BorrowReq SET Status = 'Approved', lectname = ? WHERE Reqid = ?`;
        db.query(sql, [lecturerName, reqId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.rejectBorrowRequest = (requestId, lectname, rejectReason) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE BorrowReq SET Status = 'Reject', lectname = ?, Comment = ? WHERE Reqid = ?`;
        db.query(sql, [lectname, rejectReason, requestId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.getAllHistory = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT br.*, a.Assetname, a.Assetimg, a.Assetstatus, a.Staffaddid, a.Assetcode, a.Assetlocation
            FROM BorrowReq br
            LEFT JOIN Asset a ON br.Assetid = a.Assetid
            ORDER BY br.Borrowdate DESC
        `;
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}; 