const pool = require('../config/db');

const BorrowHistory = {
  async getByBorrowname(Borrowname) {
    const [rows] = await pool.query(
      `SELECT br.*, a.Assetname, a.Assetcode FROM borrowreq br
       JOIN asset a ON br.Assetid = a.Assetid
       WHERE br.Borrowname COLLATE utf8mb4_unicode_ci = ? COLLATE utf8mb4_unicode_ci ORDER BY br.Borrowdate DESC`,
      [Borrowname]
    );
    return rows;
  },
  async getAll() {
    const [rows] = await pool.query(
      `SELECT br.*, u.username, a.Assetname, a.Assetcode FROM borrowreq br
       JOIN user u ON br.Borrowname COLLATE utf8mb4_unicode_ci = u.username COLLATE utf8mb4_unicode_ci
       JOIN asset a ON br.Assetid = a.Assetid
       ORDER BY br.Borrowdate DESC`
    );
    return rows;
  },
  async getAssetHistory(Assetid) {
    const [rows] = await pool.query(
      `SELECT * FROM assethistory WHERE Assetid = ? ORDER BY ActionDate DESC`,
      [Assetid]
    );
    return rows;
  }
};

module.exports = BorrowHistory; 