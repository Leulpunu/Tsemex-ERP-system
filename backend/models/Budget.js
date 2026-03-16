const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide budget name'],
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  allocated: {
    type: Number,
    required: true,
    min: 0
  },
  spent: {
    type: Number,
    default: 0
  },
  remaining: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'over_budget'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Compound index for unique budget per company per category per month
budgetSchema.index({ companyId: 1, year: 1, month: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);

