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
  async getAllTypes() {
    const [rows] = await pool.query('SELECT DISTINCT Assettype FROM asset WHERE Assettype IS NOT NULL AND Assettype != ""');
    return rows.map(r => r.Assettype);
  },
  async getAllAssetTypes() {
    const [rows] = await pool.query('SELECT asset_type_id, asset_type_name FROM asset_type ORDER BY asset_type_name');
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
  },
  async createAssetType(asset_type_name) {
    const [result] = await pool.query('INSERT INTO asset_type (asset_type_name) VALUES (?)', [asset_type_name]);
    const [rows] = await pool.query('SELECT asset_type_id, asset_type_name FROM asset_type WHERE asset_type_id = ?', [result.insertId]);
    return rows[0];
  },
  async getAllLocations() {
    const [rows] = await pool.query('SELECT DISTINCT Assetlocation FROM asset WHERE Assetlocation IS NOT NULL AND Assetlocation != ""');
    return rows.map(r => r.Assetlocation);
  },
  async getAllStatuses() {
    const [rows] = await pool.query('SELECT DISTINCT Assetstatus FROM asset WHERE Assetstatus IS NOT NULL AND Assetstatus != ""');
    return rows.map(r => r.Assetstatus);
  }
};

module.exports = Equipment; 