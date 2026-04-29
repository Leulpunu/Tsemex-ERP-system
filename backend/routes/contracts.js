const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

// GET /api/contracts
router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = { companyId };
    if (req.query.status) query.status = req.query.status;
    if (req.query.customerId) query.customerId = req.query.customerId;

    const contracts = await Contract.find(query)
      .populate('customerId supplierId linkedInvoices')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: contracts.length, data: contracts });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/contracts
router.post('/', protect, authorize('sales_manager', 'company_admin'), async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const contract = new Contract({ ...req.body, companyId });
    await contract.save();
    res.status(201).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/contracts/:id/bill - Generate invoice from milestone
router.post('/:id/bill', protect, authorize('accountant'), async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('customerId');
    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    // Create invoice from milestone (stub)
    const invoice = await Invoice.create({
      companyId: contract.companyId,
      customerId: contract.customerId._id,
      invoiceType: 'sale',
      subtotal: req.body.amount || 1000,
      total: req.body.amount || 1000
    });

    contract.linkedInvoices.push(invoice._id);
    contract.billingSchedule[0].invoiceId = invoice._id; // First milestone
    contract.billingSchedule[0].invoiceGenerated = true;
    await contract.save();

    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/contracts/:id/renew
router.put('/:id/renew', protect, authorize('sales_manager'), async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    contract.status = 'renewed';
    contract.endDate = new Date(req.body.newEndDate);
    contract.renewalDate = null;
    await contract.save();
    res.json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

