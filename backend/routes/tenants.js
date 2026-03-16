const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const { protect } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { status } = req.query;
    if (status) query.status = status;
    const tenants = await Tenant.find(query).populate('propertyId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: tenants });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const tenant = await Tenant.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: tenant });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json({ success: true, data: tenant });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

