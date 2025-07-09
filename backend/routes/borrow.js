const express = require('express');
const router = express.Router();
const BorrowRequest = require('../models/borrowRequest');
const BorrowHistory = require('../models/borrowHistory');
const { authenticateToken, isStaff, isUser } = require('../middleware/auth');

// User ขอยืมของ
router.post('/request', authenticateToken, isUser, async (req, res) => {
  const Borrowname = req.user.username;
  const { Assetid, Borrowdate, ReturnDate, Activity, UsageType } = req.body;
  const id = await BorrowRequest.create({ Assetid, Borrowname, Borrowdate, ReturnDate, Activity, UsageType });
  res.json({ id });
});
// Staff อนุมัติ
router.post('/approve/:id', authenticateToken, isStaff, async (req, res) => {
  await BorrowRequest.approve(req.params.id, req.user.username);
  res.json({ message: 'approved' });
});
// Staff ปฏิเสธ
router.post('/reject/:id', authenticateToken, isStaff, async (req, res) => {
  const { Comment } = req.body;
  await BorrowRequest.reject(req.params.id, req.user.username, Comment);
  res.json({ message: 'rejected' });
});
// User แจ้งคืน
router.post('/return/:id', authenticateToken, isUser, async (req, res) => {
  await BorrowRequest.returnItem(req.params.id);
  res.json({ message: 'returned' });
});
// ดูประวัติการยืมของตัวเอง
router.get('/history', authenticateToken, isUser, async (req, res) => {
  const history = await BorrowHistory.getByBorrowname(req.user.username);
  res.json(history);
});
// staff/admin ดูประวัติทั้งหมด
router.get('/all-history', authenticateToken, async (req, res) => {
  if (req.user.role === 3 || req.user.role === 2) {
    const history = await BorrowHistory.getAll();
    res.json(history);
  } else {
    res.sendStatus(403);
  }
});
// staff ดูรายการรออนุมัติ
router.get('/pending', authenticateToken, isStaff, async (req, res) => {
  const all = await BorrowRequest.getAll();
  const pending = all.filter(r => r.Status === 'Pending');
  res.json(pending);
});
// User ดูรายการที่ยืมอยู่
router.get('/active', authenticateToken, isUser, async (req, res) => {
  const active = await BorrowRequest.getActiveByBorrowname(req.user.username);
  res.json(active);
});
// staff ดูรายการรอการยืนยันคืน
router.get('/return-pending', authenticateToken, isStaff, async (req, res) => {
  const pending = await BorrowRequest.getReturnPending();
  res.json(pending);
});
// staff ยืนยันการคืน
router.post('/confirm-return/:id', authenticateToken, isStaff, async (req, res) => {
  await BorrowRequest.confirmReturn(req.params.id, req.user.username);
  res.json({ message: 'confirmed' });
});
// staff ปฏิเสธการคืน
router.post('/reject-return/:id', authenticateToken, isStaff, async (req, res) => {
  const { Comment } = req.body;
  await BorrowRequest.rejectReturn(req.params.id, req.user.username, Comment);
  res.json({ message: 'rejected' });
});

module.exports = router; 