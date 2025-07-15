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
  async updateUser(id, { username, role, phonenum, department, useremail, password, picture }) {
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE user SET username = ?, role = ?, phonenum = ?, department = ?, useremail = ?, password = ?, picture = ? WHERE userid = ?', [username, role, phonenum, department, useremail, hash, picture, id]);
    } else if (picture !== undefined) {
      await pool.query('UPDATE user SET username = ?, role = ?, phonenum = ?, department = ?, useremail = ?, picture = ? WHERE userid = ?', [username, role, phonenum, department, useremail, picture, id]);
    } else {
      await pool.query('UPDATE user SET username = ?, role = ?, phonenum = ?, department = ?, useremail = ? WHERE userid = ?', [username, role, phonenum, department, useremail, id]);
    }
  },
  async updateProfileImage(userid, picturePath) {
    await pool.query('UPDATE user SET picture = ? WHERE userid = ?', [picturePath, userid]);
  },
  async deleteUser(id) {
    await pool.query('DELETE FROM user WHERE userid = ?', [id]);
  },
  async findOrCreateGoogle(profile) {
    try {
      const useremail = profile.emails[0].value;
      let [rows] = await pool.query('SELECT * FROM user WHERE google_id = ?', [profile.id]);
      if (rows.length > 0) {
        // Update picture if changed
        const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        if (picture) {
          await pool.query('UPDATE user SET picture = ? WHERE google_id = ?', [picture, profile.id]);
        }
        [rows] = await pool.query('SELECT * FROM user WHERE google_id = ?', [profile.id]);
        return rows[0];
      }
      [rows] = await pool.query('SELECT * FROM user WHERE useremail = ?', [useremail]);
      if (rows.length > 0) {
        await pool.query('UPDATE user SET google_id = ? WHERE useremail = ?', [profile.id, useremail]);
        // Update picture if changed
        const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        if (picture) {
          await pool.query('UPDATE user SET picture = ? WHERE useremail = ?', [picture, useremail]);
        }
        [rows] = await pool.query('SELECT * FROM user WHERE useremail = ?', [useremail]);
        return rows[0];
      }
      const username = profile.displayName;
      const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
      await pool.query('INSERT INTO user (username, useremail, google_id, role, picture) VALUES (?, ?, ?, ?, ?)', [username, useremail, profile.id, 1, picture]);
      [rows] = await pool.query('SELECT * FROM user WHERE google_id = ?', [profile.id]);
      return rows[0];
    } catch (err) {
      console.error('findOrCreateGoogle error:', err);
      throw err;
    }
    // ถ้าไม่มีทั้ง google_id และ useremail ให้ return null (ไม่สร้าง user ใหม่)
    return null;
  },
  async changePassword(userid, currentPassword, newPassword) {
    // Get user by id
    const [rows] = await pool.query('SELECT * FROM user WHERE userid = ?', [userid]);
    const user = rows[0];
    if (!user) throw new Error('ไม่พบผู้ใช้');
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    if (newPassword.length < 6) throw new Error('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE user SET password = ? WHERE userid = ?', [hash, userid]);
    return true;
  },
  async findByStudentCode(studentCode) {
    // studentCode is the number before @ in useremail
    const [rows] = await pool.query("SELECT * FROM user WHERE LEFT(useremail, LOCATE('@', useremail) - 1) = ?", [studentCode]);
    return rows[0];
  }
};

module.exports = User; 