const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.register = async (userData) => {
    const { username, password, role, phonenum, department, useremail } = userData;
    if (!username || !password || !role || !phonenum || !department || !useremail) {
        throw { status: 400, message: 'All fields are required!' };
    }
    const emailRegex = /^[0-9]{10}@lamduan\.mfu\.ac\.th$/;
    if (!emailRegex.test(useremail)) {
        throw { status: 400, message: "Invalid email format! Use 'xxxx@lamduan.mfu.ac.th'" };
    }
    const exists = await userModel.findByUsernameOrEmailForRegister(username, useremail);
    if (exists.length > 0) {
        throw { status: 400, message: 'Username or Email already exists!' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser({ username, password: hashedPassword, role, phonenum, department, useremail });
    return { message: 'Successfully registered!' };
};

exports.login = async (identifier, password) => {
    const users = await userModel.findByUsernameOrEmail(identifier);
    if (users.length !== 1) {
        throw { status: 401, message: 'Wrong username/email or password!!' };
    }
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw { status: 401, message: 'Wrong username/email or password!!' };
    }
    return {
        success: true,
        username: user.username,
        userid: user.userid,
        department: user.department || 'Undefined',
        useremail: user.useremail,
        phonenum: user.phonenum
    };
};

exports.getRole = async (username) => {
    if (!username) {
        throw { status: 400, message: 'Username is required' };
    }
    const results = await userModel.getRoleByUsername(username);
    console.log('getRole results:', results);
    if (results.length !== 1) {
        throw { status: 401, message: 'Wrong username or user not found!!' };
    }
    const userRole = results[0].role;
    console.log('getRole userRole:', userRole);
    if (userRole === 1) return { role: 'student' };
    if (userRole === 2) return { role: 'staff' };
    if (userRole === 3) return { role: 'lecturer' };
    throw { status: 403, message: 'Invalid role' };
};

exports.getAllUsers = async () => {
    const users = await userModel.getAll();
    return users;
};

exports.updateUser = async (userId, userData) => {
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }
    return await userModel.updateUser(userId, userData);
}; 