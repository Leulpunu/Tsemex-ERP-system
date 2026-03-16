const express = require('express');
const router = express.Router();
const CustomsDoc = require('../models/CustomsDoc');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { shipmentId, status } = req.query;
    const query = {};
    if (shipmentId) query.shipmentId = shipmentId;
    if (status) query.status = status;
    const docs = await CustomsDoc.find(query).sort({ filedDate: -1 });
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const doc = await CustomsDoc.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

