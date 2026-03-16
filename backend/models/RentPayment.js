const mongoose = require('mongoose');

const rentPaymentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  paymentNumber: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  lateFee: {
    type: Number,
    default: 0
  },
  otherCharges: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  periodFrom: {
    type: Date,
    required: true
  },
  periodTo: {
    type: Date,
    required: true
  },
  method: {
    type: String,
    enum: ['cash', 'bank_transfer', 'cheque', 'card', 'online', 'other'],
    default: 'bank_transfer'
  },
  reference: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate payment number before saving
rentPaymentSchema.pre('save', async function(next) {
  if (!this.paymentNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.constructor.countDocuments({ companyId: this.companyId }) + 1;
    this.paymentNumber = `RENT-${year}${month}-${String(count).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('RentPayment', rentPaymentSchema);

