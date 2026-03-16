const express = require('express');
const router = express.Router();
const Contractor = require('../models/Contractor');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const contractors = await Contractor.find(query).sort({ name: 1 });
    res.json({ success: true, data: contractors });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, authorize('super_admin', 'company_admin', 'project_manager'), async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const contractor = await Contractor.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: contractor });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contractor) return res.status(404).json({ message: 'Contractor not found' });
    res.json({ success: true, data: contractor });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

