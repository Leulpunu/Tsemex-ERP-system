const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { accountId, type, startDate, endDate } = req.query;
    if (accountId) query.accountId = accountId;
    if (type) query.type = type;
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const transactions = await Transaction.find(query)
      .populate('accountId', 'name type')
      .populate('createdBy', 'name')
      .sort({ date: -1 });
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, authorize('super_admin', 'company_admin', 'accountant'), [
  body('accountId').notEmpty().withMessage('Account ID is required'),
  body('type').isIn(['debit', 'credit']).withMessage('Valid transaction type is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const companyId = getCompanyId(req);
    const { accountId, type, amount, description, reference, date } = req.body;

    const transaction = await Transaction.create({
      companyId, accountId, type, amount, description, reference, date: date || new Date(), createdBy: req.user._id
    });

    // Update account balance
    const account = await Account.findById(accountId);
    if (type === 'debit') account.balance -= amount;
    else account.balance += amount;
    await account.save();

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

