const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const budgets = await Budget.find(query).sort({ year: -1, month: -1 });
    res.json({ success: true, count: budgets.length, data: budgets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, authorize('super_admin', 'company_admin', 'accountant'), async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const budget = await Budget.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, authorize('super_admin', 'company_admin', 'accountant'), async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ success: true, data: budget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

