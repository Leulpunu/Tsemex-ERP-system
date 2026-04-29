const express = require('express');
const router = express.Router();
const IntercompanyTransaction = require('../models/IntercompanyTransaction');
const Company = require('../models/Company');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// GET /api/intercompany - List pending/approved
router.get('/', protect, authorize('company_admin'), async (req, res) => {
  try {
    const { companyId, toCompanyId, status } = req.query;
    const query = {};
    if (companyId) query.$or = [{ fromCompany: companyId }, { toCompany: companyId }];
    if (toCompanyId) query.toCompany = toCompanyId;
    if (status) query.status = status;

    const transactions = await IntercompanyTransaction.find(query)
      .populate('fromCompany toCompany fromAccount toAccount')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/intercompany - Create transaction
router.post('/', protect, authorize('company_admin'), [
  body('toCompany').notEmpty(),
  body('amount').isFloat({ min: 0 }),
  body('type').isIn(['payment', 'transfer', 'adjustment'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const fromCompany = req.user.companyId;
    const transaction = await IntercompanyTransaction.create({
      ...req.body,
      fromCompany
    });
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/intercompany/:id/approve - Approve & post
router.put('/:id/approve', protect, authorize('company_admin'), async (req, res) => {
  try {
    const txn = await IntercompanyTransaction.findById(req.params.id)
      .populate('fromCompany toCompany fromAccount toAccount');
    if (!txn || txn.status !== 'pending') return res.status(400).json({ message: 'Invalid status' });

    // Post to both companies
    await Promise.all([
      Transaction.create({
        companyId: txn.fromCompany._id,
        description: `Intercompany ${txn.type} to ${txn.toCompany.name}`,
        amount: txn.amount,
        type: 'debit',
        accountId: txn.fromAccount._id
      }),
      Transaction.create({
        companyId: txn.toCompany._id,
        description: `Intercompany ${txn.type} from ${txn.fromCompany.name}`,
        amount: txn.amount,
        type: 'credit',
        accountId: txn.toAccount._id
      })
    ]);

    txn.status = 'completed';
    txn.approvedBy = req.user._id;
    await txn.save();

    res.json({ success: true, data: txn });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

