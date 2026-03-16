const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { status, customerId } = req.query;
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;

    const invoices = await Invoice.find(query)
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('customerId', 'name email phone address');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, authorize('super_admin', 'company_admin', 'accountant'), async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const invoiceData = { ...req.body, companyId };
    const invoice = await Invoice.create(invoiceData);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, authorize('super_admin', 'company_admin', 'accountant'), async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', protect, authorize('super_admin', 'company_admin'), async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    await invoice.deleteOne();
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

