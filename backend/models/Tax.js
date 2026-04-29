const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['vat', 'sales_tax', 'gst', 'pst', 'excise', 'customs'],
    required: true
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  compound: {
    type: Boolean,
    default: false
  },
  appliesTo: {
    type: [String],
    enum: ['goods', 'services', 'both', 'exports', 'imports']
  },
  recoveryType: {
    type: String,
    enum: ['full', 'partial', 'none']
  },
  accounts: {
    receivable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    },
    payable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  effectiveDate: Date,
  endDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Tax', taxSchema);

