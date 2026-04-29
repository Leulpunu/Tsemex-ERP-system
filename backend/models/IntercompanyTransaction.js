const mongoose = require('mongoose');

const intercompanyTransactionSchema = new mongoose.Schema({
  fromCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  toCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  type: {
    type: String,
    enum: ['payment', 'transfer', 'adjustment', 'consolidation'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Currency'
  },
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  description: String,
  reference: String, // Invoice/PO number
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rate: {
    type: Number,
    default: 1
  },
  baseAmount: Number // Converted to base currency
}, {
  timestamps: true
});

module.exports = mongoose.model('IntercompanyTransaction', intercompanyTransactionSchema);

