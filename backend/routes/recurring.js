const express = require('express');
const router = express.Router();
const RecurringBilling = require('../models/RecurringBilling');
const Invoice = require('../models/Invoice');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

// GET /api/recurring
router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const { status, upcoming } = req.query;
    const query = { companyId };
    if (status) query.status = status;
    if (upcoming === 'true') {
      query.nextBillingDate = { $lt: new Date(Date.now() + 7*24*60*60*1000) }; // Next 7 days
    }

    const recurring = await RecurringBilling.find(query)
      .populate('customerId', 'name email')
      .populate('contractId', 'title number')
      .sort({ nextBillingDate: 1 });

    res.json({ success: true, count: recurring.length, data: recurring });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/recurring
router.post('/', protect, authorize('super_admin', 'company_admin'), async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const data = { ...req.body, companyId, createdBy: req.user._id };
    
    // Generate nextBillingDate based on cycle
    const now = new Date();
    let nextDate = new Date(now);
    switch (data.billingCycle) {
      case 'weekly':
        nextDate.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(now.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(now.getMonth() + 3);
        break;
      case 'annual':
        nextDate.setFullYear(now.getFullYear() + 1);
        break;
    }
    data.nextBillingDate = nextDate;

    const recurring = await RecurringBilling.create(data);
    res.status(201).json({ success: true, data: recurring });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/recurring/:id/generate-invoice
router.post('/:id/generate', protect, authorize('super_admin', 'accountant'), async (req, res) => {
  try {
    const recurring = await RecurringBilling.findById(req.params.id).populate('customerId contractId');
    if (!recurring) return res.status(404).json({ message: 'Recurring billing not found' });

    // Create invoice
    const invoice = await Invoice.create({
      companyId: recurring.companyId,
      customerId: recurring.customerId._id,
      invoiceType: 'sale',
      items: recurring.items,
      subtotal: recurring.subtotal,
      total: recurring.total,
      status: 'sent',
      notes: `Auto-generated from recurring #${recurring.number}`,
      createdBy: req.user._id
    });

    // Update next date
    let nextDate = new Date(recurring.nextBillingDate);
    switch (recurring.billingCycle) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'annual':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    recurring.nextBillingDate = nextDate;
    recurring.generatedInvoices.push(invoice._id);
    await recurring.save();

    res.json({ success: true, data: { invoice, nextBillingDate: recurring.nextBillingDate } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/recurring/:id
router.put('/:id', protect, authorize('super_admin', 'company_admin'), async (req, res) => {
  try {
    const recurring = await RecurringBilling.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customerId');
    res.json({ success: true, data: recurring });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
