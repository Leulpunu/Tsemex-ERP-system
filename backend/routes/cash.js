const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const CashAccount = require('../models/CashAccount');
const Transaction = require('../models/Transaction');
const { protect, authorize, hasModulePermission } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

// GET /api/cash - List cash accounts
router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const cashAccounts = await CashAccount.find({ companyId })
      .populate('accountId', 'name code balance')
      .populate('currency', 'code symbol');
    res.json({ success: true, count: cashAccounts.length, data: cashAccounts });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/cash/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const cashAccount = await CashAccount.findById(req.params.id).populate('accountId currency');
    if (!cashAccount) return res.status(404).json({ message: 'Cash account not found' });
    res.json({ success: true, data: cashAccount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/cash - Create cash account
router.post('/', protect, authorize('super_admin', 'company_admin', 'accountant'), [
  body('name').notEmpty(),
  body('accountNumber').notEmpty(),
  body('bankName').notEmpty(),
  body('type').isIn(['checking', 'savings', 'petty_cash', 'credit_card'])
], async (req, res) => {
  try {
    if (!hasModulePermission(req.user, 'finance', 'cash', 'c')) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const companyId = getCompanyId(req);
    const cashAccount = await CashAccount.create({ ...req.body, companyId });
    
    res.status(201).json({ success: true, data: cashAccount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/cash/:id/reconcile
router.put('/:id/reconcile', protect, authorize('accountant'), async (req, res) => {
  try {
    const { endingBalance } = req.body;
    const cashAccount = await CashAccount.findById(req.params.id);
    if (!cashAccount) return res.status(404).json({ message: 'Cash account not found' });

    cashAccount.balance = endingBalance;
    cashAccount.lastReconciled = new Date();
    await cashAccount.save();

    res.json({ success: true, data: cashAccount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/cash/transfer
router.post('/transfer', protect, authorize('accountant'), async (req, res) => {
  try {
    const { fromAccount, toAccount, amount, description } = req.body;
    const companyId = getCompanyId(req);

    // Debit from
    await Transaction.create({
      companyId,
      accountId: fromAccount,
      type: 'debit',
      amount,
      description: `${description} (transfer out)`,
      createdBy: req.user._id
    });

    // Credit to
    await Transaction.create({
      companyId,
      accountId: toAccount,
      type: 'credit',
      amount,
      description: `${description} (transfer in)`,
      createdBy: req.user._id
    });

    res.json({ success: true, message: 'Transfer completed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
