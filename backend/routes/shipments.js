const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const { protect } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { status } = req.query;
    if (status) query.status = status;
    const shipments = await Shipment.find(query).populate('supplierId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: shipments });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const shipment = await Shipment.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

