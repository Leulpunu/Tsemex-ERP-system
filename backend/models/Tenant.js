const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  idProof: {
    type: String,
    trim: true
  },
  idNumber: {
    type: String,
    trim: true
  },
  leaseStart: {
    type: Date,
    required: true
  },
  leaseEnd: {
    type: Date,
    required: true
  },
  rentAmount: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  paymentDueDay: {
    type: Number,
    default: 1,
    min: 1,
    max: 28
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'terminated', 'pending'],
    default: 'active'
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tenant', tenantSchema);

