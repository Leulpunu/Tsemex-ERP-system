const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const { protect } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { status } = req.query;
    if (status) query.status = status;
    const equipment = await Equipment.find(query).sort({ name: 1 });
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const equipment = await Equipment.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

