const express = require('express');
const router = express.Router();
const RentPayment = require('../models/RentPayment');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { tenantId, status } = req.query;
    const query = {};
    if (tenantId) query.tenantId = tenantId;
    if (status) query.status = status;
    const payments = await RentPayment.find(query).populate('tenantId', 'name').sort({ date: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const payment = await RentPayment.create(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

