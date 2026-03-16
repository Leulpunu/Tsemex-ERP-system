const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { protect } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { date, employeeId, startDate, endDate } = req.query;
    
    if (date) query.date = new Date(date);
    if (employeeId) query.employeeId = employeeId;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const attendance = await Attendance.find(query)
      .populate('employeeId', 'firstName lastName employeeId')
      .sort({ date: -1 });
    res.json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/checkin', protect, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      employeeId,
      date: { $gte: today }
    });

    if (existing && existing.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: { $gte: today } },
      { checkIn: new Date(), status: 'present', companyId: req.user.companyId },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/checkout', protect, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: today }
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ message: 'No check-in found for today' });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

