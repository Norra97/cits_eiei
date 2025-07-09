const pool = require('../config/db');
const Equipment = require('./equipment');

const BorrowRequest = {
  async create({ Assetid, Borrowname, Borrowdate, ReturnDate, Activity, UsageType }) {
    const [result] = await pool.query(
      'INSERT INTO borrowreq (Assetid, Borrowname, Borrowdate, ReturnDate, Status, Activity, UsageType) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Assetid, Borrowname, Borrowdate, ReturnDate, 'Pending', Activity, UsageType]
    );
    return result.insertId;
  },
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM borrowreq');
    return rows;
  },
  async getByBorrowname(Borrowname) {
    const [rows] = await pool.query('SELECT * FROM borrowreq WHERE Borrowname = ?', [Borrowname]);
    return rows;
  },
  async approve(Reqid, lectname) {
    await pool.query('UPDATE borrowreq SET Status = ?, lectname = ? WHERE Reqid = ?', ['Approved', lectname, Reqid]);
    // Update asset status to 'Borrowing'
    const [rows] = await pool.query('SELECT Assetid FROM borrowreq WHERE Reqid = ?', [Reqid]);
    if (rows.length > 0) {
      await Equipment.updateStatus(rows[0].Assetid, 'Borrowing');
    }
  },
  async reject(Reqid, lectname, Comment) {
    await pool.query('UPDATE borrowreq SET Status = ?, lectname = ?, Comment = ? WHERE Reqid = ?', ['Reject', lectname, Comment, Reqid]);
  },
  async returnItem(Reqid) {
    await pool.query('UPDATE borrowreq SET Status = ? WHERE Reqid = ?', ['RePending', Reqid]);
  },
  async getActiveByBorrowname(Borrowname) {
    const [rows] = await pool.query(
      `SELECT br.*, a.Assetname, a.Assetcode FROM borrowreq br
       JOIN asset a ON br.Assetid = a.Assetid
       WHERE br.Borrowname = ? AND br.Status = 'Approved'`,
      [Borrowname]
    );
    return rows;
  },
  async getReturnPending() {
    const [rows] = await pool.query('SELECT * FROM borrowreq WHERE Status = ?', ['RePending']);
    return rows;
  },
  async confirmReturn(Reqid, lectname) {
    await pool.query('UPDATE borrowreq SET Status = ?, lectname = ? WHERE Reqid = ?', ['Returned', lectname, Reqid]);
    // อัปเดตสถานะ asset เป็น Available
    const [rows] = await pool.query('SELECT Assetid FROM borrowreq WHERE Reqid = ?', [Reqid]);
    if (rows.length > 0) {
      await Equipment.updateStatus(rows[0].Assetid, 'Available');
    }
  },
  async rejectReturn(Reqid, lectname, Comment) {
    await pool.query('UPDATE borrowreq SET Status = ?, lectname = ?, Comment = ? WHERE Reqid = ?', ['ReturnRejected', lectname, Comment, Reqid]);
  }
};

module.exports = BorrowRequest; 