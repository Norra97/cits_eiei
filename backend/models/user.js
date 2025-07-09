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
  }
};

module.exports = User; 