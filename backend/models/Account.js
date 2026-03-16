const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide account name'],
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['asset', 'liability', 'equity', 'income', 'expense'],
    required: true
  },
  subType: {
    type: String,
    enum: ['current_asset', 'fixed_asset', 'current_liability', 'long_term_liability', 'capital', 'retained_earnings', 'revenue', 'cost_of_goods_sold', 'operating_expense', 'non_operating']
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  balance: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBankAccount: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for unique account code per company
accountSchema.index({ companyId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Account', accountSchema);

