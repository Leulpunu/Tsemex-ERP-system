const express = require('express');
const router = express.Router();
const DeferredRevenue = require('../models/DeferredRevenue');
const Invoice = require('../models/Invoice');
const Transaction = require('../models/Transaction');
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

// POST /api/deferred-revenue - Create from invoice
router.post('/', protect, authorize('accountant'), [
  body('invoiceId').notEmpty(),
  body('amount').isFloat({ min: 0 }),
  body('totalPeriods').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { invoiceId, amount, totalPeriods, recognitionMethod = 'straight_line' } = req.body;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + totalPeriods);

    const periodAmount = amount / totalPeriods;
    const schedule = [];
    for (let i = 1; i <= totalPeriods; i++) {
      schedule.push({
        period: i,
        date: new Date(startDate.getFullYear(), startDate.getMonth() + i - 1, 1),
        amount: periodAmount
      });
    }

    const deferred = await DeferredRevenue.create({
      companyId: invoice.companyId,
      invoiceId,
      amount,
      recognitionMethod,
      totalPeriods,
      startDate,
      endDate,
      periodAmount,
      schedule
    });

    res.status(201).json({ success: true, data: deferred });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/deferred-revenue - List
router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const deferred = await DeferredRevenue.find({ companyId })
      .populate('invoiceId', 'invoiceNumber total customerId')
      .sort({ startDate: -1 });
    res.json({ success: true, count: deferred.length, data: deferred });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/deferred-revenue/:id/recognize - Recognize next period
router.post('/:id/recognize', protect, authorize('accountant'), async (req, res) => {
  try {
    const deferred = await DeferredRevenue.findById(req.params.id).populate('invoiceId');
    if (!deferred || deferred.status !== 'active') return res.status(400).json({ message: 'Cannot recognize' });

    const nextPeriod = deferred.schedule.find(p => !p.status || p.status !== 'recognized');
    if (!nextPeriod) return res.status(400).json({ message: 'All periods recognized' });

    // Create revenue recognition transaction
    await Transaction.create({
      companyId: deferred.companyId,
      description: `Deferred revenue recognition - Invoice ${deferred.invoiceId.invoiceNumber} Period ${nextPeriod.period}`,
      amount: nextPeriod.amount,
      type: 'credit',
      category: 'revenue_recognition'
    });

    nextPeriod.status = 'recognized';
    deferred.recognizedAmount += nextPeriod.amount;
    deferred.remainingAmount -= nextPeriod.amount;
    if (deferred.remainingAmount <= 0) deferred.status = 'completed';

    await deferred.save();

    res.json({ success: true, data: deferred });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

