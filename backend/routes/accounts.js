const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Account = require('../models/Account');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const accounts = await Account.find(query).populate('parentId', 'name').sort({ type: 1, name: 1 });
    res.json({ success: true, count: accounts.length, data: accounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).populate('parentId', 'name');
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json({ success: true, data: account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, authorize('super_admin', 'company_admin', 'accountant'), [
  body('name').notEmpty().withMessage('Account name is required'),
  body('type').isIn(['asset', 'liability', 'income', 'expense', 'equity']).withMessage('Valid account type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const companyId = getCompanyId(req);
    const account = await Account.create({ ...req.body, companyId, balance: 0 });
    res.status(201).json({ success: true, data: account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, authorize('super_admin', 'company_admin', 'accountant'), async (req, res) => {
  try {
    let account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', protect, authorize('super_admin', 'company_admin'), async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    await account.deleteOne();
    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

