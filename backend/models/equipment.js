const pool = require('../config/db');

const Equipment = {
  async create({ Assetname, Assetdetail, Assetcode, Assetlocation, Assetimg, Staffaddid, Assetstatus, Assettype }) {
    const [result] = await pool.query('INSERT INTO asset (Assetname, Assetdetail, Assetcode, Assetlocation, Assetimg, Staffaddid, Assetstatus, Assettype) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [Assetname, Assetdetail, Assetcode, Assetlocation, Assetimg, Staffaddid, Assetstatus, Assettype]);
    return result.insertId;
  },
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM asset');
    return rows;
  },
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM asset WHERE Assetid = ?', [id]);
    return rows[0];
  },
  async update(id, { Assetname, Assetdetail, Assetcode, Assetlocation, Assetimg, Assetstatus, Assettype }) {
    await pool.query(
      'UPDATE asset SET Assetname = ?, Assetdetail = ?, Assetcode = ?, Assetlocation = ?, Assetimg = ?, Assetstatus = ?, Assettype = ? WHERE Assetid = ?',
      [
        Assetname || '',
        Assetdetail || '',
        Assetcode || '',
        Assetlocation || 'MFU',
        Assetimg || '',
        Assetstatus || 'Available',
        Assettype || '',
        id
      ]
    );
  },
  async updateStatus(id, Assetstatus) {
    await pool.query('UPDATE asset SET Assetstatus = ? WHERE Assetid = ?', [Assetstatus, id]);
  },
  async delete(id) {
    await pool.query('DELETE FROM asset WHERE Assetid = ?', [id]);
  }
};

module.exports = Equipment; 