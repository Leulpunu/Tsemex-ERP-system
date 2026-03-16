const express = require('express');
const router = express.Router();
const HotelBooking = require('../models/HotelBooking');
const { protect } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { status } = req.query;
    if (status) query.status = status;
    const bookings = await HotelBooking.find(query).populate('roomId', 'roomNumber').sort({ checkIn: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const booking = await HotelBooking.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await HotelBooking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
