const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['construction', 'electro_mechanical', 'import_export', 'real_estate_hotel'],
    required: [true, 'Please specify company type']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true
  },
  logo: {
    type: String
  },
  registrationNumber: {
    type: String,
    trim: true
  },
  taxNumber: {
    type: String,
    trim: true
  },
  settings: {
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    dateFormat: { type: String, default: 'YYYY-MM-DD' }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);

