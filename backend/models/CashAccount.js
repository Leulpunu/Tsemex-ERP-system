const mongoose = require('mongoose');

const cashAccountSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['checking', 'savings', 'petty_cash', 'credit_card'],
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Currency',
    required: true
  },
  lastReconciled: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  bankFeedEnabled: {
    type: Boolean,
    default: false
  },
  integrationId: String // Plaid/Plaid-like bank ID
}, {
  timestamps: true
});

module.exports = mongoose.model('CashAccount', cashAccountSchema);
