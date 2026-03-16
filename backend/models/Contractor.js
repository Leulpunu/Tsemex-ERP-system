const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide contractor name'],
    trim: true
  },
  code: {
    type: String,
    trim: true,
    uppercase: true
  },
  specialty: {
    type: String,
    enum: ['electrical', 'plumbing', 'hvac', 'civil', 'painting', 'carpentry', 'architecture', 'consulting', 'other'],
    required: true
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
  taxNumber: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
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

module.exports = mongoose.model('Contractor', contractorSchema);

