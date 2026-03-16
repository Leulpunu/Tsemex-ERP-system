const express = require('express');
const router = express.Router();
const MaintenanceLog = require('../models/MaintenanceLog');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { equipmentId } = req.query;
    const query = equipmentId ? { equipmentId } : {};
    const logs = await MaintenanceLog.find(query).populate('equipmentId', 'name').sort({ date: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const log = await MaintenanceLog.create(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

