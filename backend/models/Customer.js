const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true
  },
  code: {
    type: String,
    trim: true,
    uppercase: true
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  contactPerson: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    lowercase: true
  },
  taxNumber: {
    type: String,
    trim: true
  },
  paymentTerms: {
    type: String,
    trim: true
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);

