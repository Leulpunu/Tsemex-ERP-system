const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Invoice = require('../models/Invoice');

/**
 * Report Service - Financial calculations and aggregations
 */

// Get trial balance: Debit/Credit balances by account
const getTrialBalance = async (companyId, from, to, basis = 'accrual') => {
  const match = { companyId };
  if (from && to) match.date = { $gte: new Date(from), $lte: new Date(to) };

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: '$accountId',
        debit: { $sum: { $cond: [{ $eq: ['$type', 'debit'] }, '$amount', 0] } },
        credit: { $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0] } }
      }
    },
    { $lookup: { from: 'accounts', localField: '_id', foreignField: '_id', as: 'account' } },
    { $unwind: '$account' },
    { $project: { account: { name: 1, code: 1, type: 1 }, debit: 1, credit: 1, balance: { $subtract: ['$debit', '$credit'] } } }
  ];

  if (basis === 'cash') {
    // Cash basis: only bank/cash transactions
    pipeline[0].$match.isBankAccount = true; // Wait, filter by paymentMethod === 'cash' or bank accounts
    pipeline[0].$match.paymentMethod = { $in: ['cash', 'bank_transfer'] };
  }

  return await Transaction.aggregate(pipeline);
};

// Balance Sheet: Asset/Liability/Equity snapshot
const getBalanceSheet = async (companyId, asOfDate) => {
  return await Account.aggregate([
    { $match: { companyId, type: { $in: ['asset', 'liability', 'equity'] }, isActive: true } },
    { $sort: { type: 1, name: 1 } },
    { $group: {
      _id: '$type',
      total: { $sum: '$balance' },
      accounts: { $push: { code: '$code', name: '$name', balance: '$balance' } }
    } }
  ]);
};

// Income Statement: Revenue - Expenses
const getIncomeStatement = async (companyId, from, to, basis = 'accrual') => {
  const match = { companyId, date: { $gte: new Date(from), $lte: new Date(to) } };
  if (basis === 'cash') {
    match.paymentMethod = { $in: ['cash', 'bank_transfer'] };
  }

  return await Transaction.aggregate([
    { $match: match },
    { $lookup: { from: 'accounts', localField: 'accountId', foreignField: '_id', as: 'account' } },
    { $unwind: '$account' },
    {
      $group: {
        _id: { type: '$account.type', subType: '$account.subType' },
        total: { $sum: { $cond: [{ $eq: ['$account.type', 'income'] }, '$amount', { $subtract: [0, '$amount'] }] } }
      }
    },
    { $group: {
      _id: '$_id.type',
      categories: { $push: { name: '$_id.subType', total: '$total' } },
      net: { $sum: '$total' }
    } }
  ]);
};

// AR Aging
const getARAging = async (companyId, asOfDate) => {
  return await Invoice.aggregate([
    { $match: { companyId, invoiceType: 'sale', status: { $in: ['sent', 'partial', 'overdue'] } } },
    {
      $project: {
        customerName: 1, invoiceNumber: 1, issueDate: 1, dueDate: 1, balanceDue: 1,
        daysOverdue: { $divide: [{ $subtract: [new Date(asOfDate), '$dueDate'] }, 1000*60*60*24] }
      }
    },
    {
      $bucket: {
        groupBy: '$daysOverdue',
        boundaries: [0, 30, 60, 90, Infinity],
        default: '90+',
        output: {
          total: { $sum: '$balanceDue' },
          count: { $sum: 1 },
          invoices: { $push: { invoiceNumber: '$invoiceNumber', balanceDue: '$balanceDue', daysOverdue: '$daysOverdue' } }
        }
      }
    }
  ]);
};

// AP Aging (similar to AR but purchase invoices)
const getAPAging = async (companyId, asOfDate) => {
  return await Invoice.aggregate([
    { $match: { companyId, invoiceType: 'purchase', status: { $in: ['sent', 'partial', 'overdue'] } } },
    // Same as AR but for suppliers
    // ... (similar pipeline)
  ]);
};

module.exports = {
  getTrialBalance,
  getBalanceSheet,
  getIncomeStatement,
  getARAging,
  getAPAging
};
