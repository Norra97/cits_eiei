const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
    return rows[0];
  },
  async createUser({ username, password, role, phonenum, department, useremail, google_id, picture }) {
    let hash = '';
    if (password) {
      hash = await bcrypt.hash(password, 10);
    }
    // เพิ่ม google_id, picture ถ้ามี
    const fields = ['username', 'password', 'role', 'phonenum', 'department', 'useremail'];
    const values = [username, hash, role, phonenum, department, useremail];
    if (google_id) {
      fields.push('google_id');
      values.push(google_id);
    }
    if (picture) {
      fields.push('picture');
      values.push(picture);
    }
    const sql = `INSERT INTO user (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
    const [result] = await pool.query(sql, values);
    return result.insertId;
  },
  async getAllUsers() {
    const [rows] = await pool.query('SELECT userid, username, role, phonenum, department, useremail FROM user');
    return rows;
  },
  async updateUser(id, { username, role, phonenum, department, useremail, password, picture }) {
    // สร้าง dynamic fields และ values
    const fields = ['username = ?', 'role = ?', 'phonenum = ?', 'department = ?'];
    const values = [username, role, phonenum, department];
    if (useremail) {
      fields.push('useremail = ?');
      values.push(useremail);
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      values.push(hash);
    }
    if (picture !== undefined) {
      fields.push('picture = ?');
      values.push(picture);
    }
    values.push(id);
    const sql = `UPDATE user SET ${fields.join(', ')} WHERE userid = ?`;
    await pool.query(sql, values);
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
      // NEW: Check for student code match
      const studentCode = useremail.split('@')[0];
      [rows] = await pool.query("SELECT * FROM user WHERE LEFT(useremail, LOCATE('@', useremail) - 1) = ?", [studentCode]);
      if (rows.length > 0) {
        await pool.query('UPDATE user SET google_id = ? WHERE userid = ?', [profile.id, rows[0].userid]);
        const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        if (picture) {
          await pool.query('UPDATE user SET picture = ? WHERE userid = ?', [picture, rows[0].userid]);
        }
        [rows] = await pool.query('SELECT * FROM user WHERE userid = ?', [rows[0].userid]);
        return rows[0];
      }
      // END NEW
      // ถ้าเป็น email มหาวิทยาลัยและยังไม่มีในระบบ ให้สร้าง user ใหม่อัตโนมัติ
      if (
        (useremail.endsWith('@mfu.ac.th') || useremail.endsWith('@lamduan.mfu.ac.th'))
      ) {
        const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        const [result] = await pool.query(
          'INSERT INTO user (username, role, phonenum, department, useremail, google_id, picture) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            profile.displayName,
            1, // role user
            '', // phonenum
            '', // department (เว้นว่าง)
            useremail,
            profile.id,
            picture
          ]
        );
        const [rows2] = await pool.query('SELECT * FROM user WHERE userid = ?', [result.insertId]);
        return rows2[0];
      }
      // If no match, return a special object to trigger link-account flow
      return {
        need_link: true,
        google_id: profile.id || (profile.google_id ? profile.google_id : null),
        username: profile.displayName,
        useremail: useremail,
        picture: (profile.photos && profile.photos[0] && profile.photos[0].value) ? profile.photos[0].value : null
      };
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