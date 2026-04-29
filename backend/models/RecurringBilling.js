const mongoose = require('mongoose');

const recurringItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, default: 0 },
  total: { type: Number, required: true }
});

const recurringBillingSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  number: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  items: [recurringItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  taxTotal: { type: Number, default: 0 },
  total: { type: Number, required: true, min: 0 },
  billingCycle: {
    type: String,
    enum: ['weekly', 'monthly', 'quarterly', 'annual'],
    required: true
  },
  startDate: { type: Date, required: true },
  nextBillingDate: { type: Date, required: true },
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'completed'],
    default: 'active'
  },
  generatedInvoices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }],
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate number
recurringBillingSchema.pre('validate', async function(next) {
  if (!this.number) {
    const prefix = 'REC';
    const count = await mongoose.model('RecurringBilling').countDocuments({ companyId: this.companyId });
    this.number = `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('RecurringBilling', recurringBillingSchema);
