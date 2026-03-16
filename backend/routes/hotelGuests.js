const express = require('express');
const router = express.Router();
const HotelGuest = require('../models/HotelGuest');
const { protect } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const guests = await HotelGuest.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: guests });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const guest = await HotelGuest.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: guest });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
