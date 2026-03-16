const express = require('express');
const router = express.Router();
const HotelRoom = require('../models/HotelRoom');
const { protect } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { type, status } = req.query;
    if (type) query.type = type;
    if (status) query.status = status;
    const rooms = await HotelRoom.find(query).sort({ roomNumber: 1 });
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const room = await HotelRoom.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const room = await HotelRoom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
