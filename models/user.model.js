const db = require('../config/db');

exports.findByUsernameOrEmail = (identifier) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT userid, username, password, role, department, useremail, phonenum FROM user WHERE username = ? OR useremail = ?`;
        db.query(sql, [identifier, identifier], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.findByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE username = ?';
        db.query(sql, [username], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.findByUsernameOrEmailForRegister = (username, useremail) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT userid FROM user WHERE username = ? OR useremail = ?';
        db.query(sql, [username, useremail], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.createUser = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user (username, password, role, phonenum, department, useremail) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [user.username, user.password, user.role, user.phonenum, user.department, user.useremail], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.getRoleByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT role FROM user WHERE username = ?';
        db.query(sql, [username], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getAll = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT userid, username, role, phonenum, department, useremail FROM user';
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.updateUser = (userId, userData) => {
    return new Promise((resolve, reject) => {
        const fields = Object.keys(userData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(userData);
        const sql = `UPDATE user SET ${fields} WHERE userid = ?`;
        db.query(sql, [...values, userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}; 