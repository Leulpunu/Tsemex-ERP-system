const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Report = require('../models/Report');
const Transaction = require('../models/Transaction');
const Invoice = require('../models/Invoice');
const reportService = require('../services/reportService');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

// @desc    Get financial summary for dashboard (real data)
// @route   GET /api/reports/summary
// @access  Private
router.get('/summary', protect, async (req, res, next) => {
  try {
    const companyId = req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;
    
    // Real aggregations
    const [revenue, expenses] = await Promise.all([
      Transaction.aggregate([
        { $match: { companyId, 'account.type': 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { companyId, 'account.type': 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const summary = {
      totalRevenue: revenue[0]?.total || 0,
      totalExpenses: expenses[0]?.total || 0,
      netProfit: (revenue[0]?.total || 0) - (expenses[0]?.total || 0)
    };

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
});

// @desc    Trial Balance
// @route   GET /api/reports/trial-balance
router.get('/trial-balance', protect, async (req, res, next) => {
  try {
    const { companyId } = getCompanyId(req);
    const { from, to, basis } = req.query;
    const data = await reportService.getTrialBalance(companyId, from, to, basis);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// @desc    Balance Sheet
// @route   GET /api/reports/balance-sheet
router.get('/balance-sheet', protect, async (req, res, next) => {
  try {
    const { companyId } = getCompanyId(req);
    const { asOf } = req.query;
    const data = await reportService.getBalanceSheet(companyId, asOf);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// @desc    Income Statement
// @route   GET /api/reports/income-statement
router.get('/income-statement', protect, async (req, res, next) => {
  try {
    const { companyId } = getCompanyId(req);
    const { from, to, basis } = req.query;
    const data = await reportService.getIncomeStatement(companyId, from, to, basis);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// @desc    AR Aging
// @route   GET /api/reports/ar-aging
router.get('/ar-aging', protect, async (req, res, next) => {
  try {
    const { companyId } = getCompanyId(req);
    const { asOf } = req.query;
    const data = await reportService.getARAging(companyId, asOf);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// @desc    AP Aging
// @route   GET /api/reports/ap-aging
router.get('/ap-aging', protect, async (req, res, next) => {
  try {
    const { companyId } = getCompanyId(req);
    const { asOf } = req.query;
    const data = await reportService.getAPAging(companyId, asOf);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Generate PDF (stub - ready for pdfkit)
router.post('/pdf/:type', protect, async (req, res, next) => {
  try {
    res.json({ success: true, message: 'PDF generated (implement pdfkit logic)' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
