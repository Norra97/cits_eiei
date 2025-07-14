const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
    return rows[0];
  },
  async createUser({ username, password, role, phonenum, department, useremail }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO user (username, password, role, phonenum, department, useremail) VALUES (?, ?, ?, ?, ?, ?)', [username, hash, role, phonenum, department, useremail]);
    return result.insertId;
  },
  async getAllUsers() {
    const [rows] = await pool.query('SELECT userid, username, role, phonenum, department, useremail FROM user');
    return rows;
  },
  async updateUser(id, { username, role, phonenum, department, useremail }) {
    await pool.query('UPDATE user SET username = ?, role = ?, phonenum = ?, department = ?, useremail = ? WHERE userid = ?', [username, role, phonenum, department, useremail, id]);
  },
  async deleteUser(id) {
    await pool.query('DELETE FROM user WHERE userid = ?', [id]);
  },
  async findOrCreateGoogle(profile) {
    try {
      const useremail = profile.emails[0].value;
      let [rows] = await pool.query('SELECT * FROM user WHERE google_id = ?', [profile.id]);
      if (rows.length > 0) return rows[0];
      [rows] = await pool.query('SELECT * FROM user WHERE useremail = ?', [useremail]);
      if (rows.length > 0) {
        await pool.query('UPDATE user SET google_id = ? WHERE useremail = ?', [profile.id, useremail]);
        [rows] = await pool.query('SELECT * FROM user WHERE useremail = ?', [useremail]);
        return rows[0];
      }
      const username = profile.displayName;
      await pool.query('INSERT INTO user (username, useremail, google_id, role) VALUES (?, ?, ?, ?)', [username, useremail, profile.id, 1]);
      [rows] = await pool.query('SELECT * FROM user WHERE google_id = ?', [profile.id]);
      return rows[0];
    } catch (err) {
      console.error('findOrCreateGoogle error:', err);
      throw err;
    }
  }
};

module.exports = User; 