const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/userRole', userController.getRole);
router.get('/users', userController.getAllUsers);
router.put('/users/:id', userController.updateUser);

module.exports = router; 