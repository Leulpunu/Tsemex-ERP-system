const mongoose = require('mongoose');

const deferredRevenueSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  recognitionMethod: {
    type: String,
    enum: ['straight_line', 'ratable', 'milestone'],
    default: 'straight_line'
  },
  totalPeriods: {
    type: Number,
    required: true,
    min: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  periodAmount: Number, // Calculated: amount / totalPeriods
  recognizedAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number,
    default: this.amount
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  schedule: [{
    period: Number,
    date: Date,
    amount: Number,
    status: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('DeferredRevenue', deferredRevenueSchema);

