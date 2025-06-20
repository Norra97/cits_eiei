const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturer.controller');

router.get('/dashboard', lecturerController.getDashboardData);

module.exports = router; 