const express = require('express');
const router = express.Router();
const staticController = require('../controllers/static.controller');
const borrowController = require('../controllers/borrow.controller');

// Student pages
router.get('/student', staticController.serveStatic('public/web_pro/student/std-dash.html'));
router.get('/student/Asset', staticController.serveStatic('public/web_pro/student/std-asset.html'));
router.get('/student/Asset-accept', staticController.serveStatic('public/web_pro/student/std-asset accept.html'));
router.get('/student/calendar', staticController.serveStatic('public/web_pro/student/calendar.html'));
router.get('/settings/std', staticController.serveStatic('public/web_pro/student/std-sta-rt.html'));
router.get('/student/sta/pd', staticController.serveStatic('public/web_pro/student/std-sta-pd.html'));
router.get('/student/sta/rt', staticController.serveStatic('public/web_pro/student/std-sta-rt.html'));
router.get('/student/sta/br', staticController.serveStatic('public/web_pro/student/std-sta-br.html'));
router.get('/student/sta/rj', staticController.serveStatic('public/web_pro/student/std-sta-rj.html'));
router.get('/student/sta/rpd', staticController.serveStatic('public/web_pro/student/std-sta-rpd.html'));
router.get('/student/set', staticController.serveStatic('public/web_pro/student/std-setting.html'));

// Staff pages
router.get('/staff', staticController.serveStatic('public/web_pro/staff/stf-dash.html'));
router.get('/staff/Edit-Asset', staticController.serveStatic('public/web_pro/staff/stf-addeditdelete.html'));
router.get('/staff/History', staticController.serveStatic('public/web_pro/staff/stf-history.html'));
router.get('/staff/History-Re', staticController.serveStatic('public/web_pro/staff/stf-history-re.html'));
router.get('/staff/Returning', staticController.serveStatic('public/web_pro/staff/stf-returning.html'));
router.get('/staff/Borrowing-requests', staticController.serveStatic('public/web_pro/staff/stf-borr-req.html'));
router.get('/settings/stf', staticController.serveStatic('public/web_pro/staff/stf-setting.html'));

// Lecturer pages
router.get('/lecturer', staticController.serveStatic('public/web_pro/lect/lec-dash.html'));
router.get('/lecturer/MangeUser', staticController.serveStatic('public/web_pro/lect/lec-mangeuser.html'));
router.get('/lecturer/history', staticController.serveStatic('public/web_pro/lect/lec-history.html'));
router.get('/settings/lec', staticController.serveStatic('public/web_pro/lect/lec-setting.html'));
router.get('/lecturer/AddAsset', staticController.serveStatic('public/web_pro/lect/lec-addasset.html'));

// Login/Register
router.get('/login', staticController.serveStatic('public/web_pro/login regis/login.html'));
router.get('/register', staticController.serveStatic('public/web_pro/login regis/register.html'));

// Logout
router.get('/logout', staticController.logout);

// New route for path '/'
router.get('/', staticController.serveStatic('public/web_pro/login regis/login.html'));

router.get('/history', borrowController.getAllHistory);
router.get('/export-csv', borrowController.exportHistoryCSV);

module.exports = router; 