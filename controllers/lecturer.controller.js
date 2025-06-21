const db = require('../config/db');

exports.getDashboardData = (req, res) => {
    // ตัวอย่าง query: นับจำนวนรายการยืม, คืน, ทรัพย์สิน
    // สามารถปรับ query ตามโครงสร้างจริงได้
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM BorrowReq) AS total_borrow,
        (SELECT COUNT(*) FROM Asset) AS total_asset
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
}; 