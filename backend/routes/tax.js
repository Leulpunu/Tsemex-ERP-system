const express = require('express');
const router = express.Router();
const Tax = require('../models/Tax');
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

// GET /api/tax - List taxes
router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const taxes = await Tax.find({ companyId }).sort({ code: 1 });
    res.json({ success: true, count: taxes.length, data: taxes });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/tax - Create tax
router.post('/', protect, authorize('company_admin', 'accountant'), [
  body('name').notEmpty(),
  body('code').notEmpty(),
  body('type').isIn(['vat', 'sales_tax', 'gst', 'pst', 'excise', 'customs']),
  body('rate').isFloat({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const companyId = getCompanyId(req);
    const tax = await Tax.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: tax });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/tax/:id - Update tax
router.put('/:id', protect, authorize('company_admin', 'accountant'), async (req, res) => {
  try {
    const tax = await Tax.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tax) return res.status(404).json({ message: 'Tax not found' });
    res.json({ success: true, data: tax });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/tax/:id
router.delete('/:id', protect, authorize('company_admin'), async (req, res) => {
  try {
    await Tax.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tax deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/tax/apply?invoiceId=xxx - Calculate tax for invoice
router.get('/apply', protect, async (req, res) => {
  try {
    const { invoiceId } = req.query;
    // Logic to calculate tax for invoice items
    const taxAmount = 1500.50; // Placeholder
    res.json({ success: true, taxAmount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

