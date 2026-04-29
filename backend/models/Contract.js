const mongoose = require('mongoose');

const contractItemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  unitPrice: Number,
  total: Number,
  deliverable: String,
  milestone: Boolean
});

const contractSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  number: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['sales', 'purchase', 'service', 'maintenance'],
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  items: [contractItemSchema],
  totalValue: {
    type: Number,
    required: true
  },
  startDate: Date,
  endDate: Date,
  renewalDate: Date,
  autoRenew: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'expired', 'terminated', 'renewed'],
    default: 'draft'
  },
  billingSchedule: [{
    milestone: String,
    percentage: Number,
    invoiceGenerated: { type: Boolean, default: false },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice'
    }
  }],
  linkedInvoices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }],
  documents: [String],
  notes: String
}, {
  timestamps: true
});

// Auto-generate contract number
contractSchema.pre('save', async function(next) {
  if (this.number) return next();
  const prefix = this.type === 'sales' ? 'SC-' : 'PC-';
  const count = await mongoose.model('Contract').countDocuments({ companyId: this.companyId });
  this.number = `${prefix}${new Date().getFullYear()}${String(count + 1).padStart(4, '0')}`;
  next();
});

module.exports = mongoose.model('Contract', contractSchema);

