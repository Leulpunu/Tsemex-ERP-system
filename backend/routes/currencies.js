const express = require('express');
const router = express.Router();
const Currency = require('../models/Currency');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const currencies = await Currency.find().sort({ code: 1 });
    res.json({ success: true, data: currencies });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const currency = await Currency.create(req.body);
    res.status(201).json({ success: true, data: currency });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const currency = await Currency.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!currency) return res.status(404).json({ message: 'Currency not found' });
    res.json({ success: true, data: currency });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

