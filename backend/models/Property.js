const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide property name'],
    trim: true
  },
  code: {
    type: String,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'land', 'hotel', 'mixed_use'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'unavailable'],
    default: 'available'
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  size: {
    value: Number,
    unit: { type: String, default: 'sqft' }
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },
  parking: {
    type: Number,
    default: 0
  },
  purchasePrice: {
    type: Number,
    default: 0
  },
  rentPrice: {
    type: Number,
    default: 0
  },
  salePrice: {
    type: Number,
    default: 0
  },
  yearBuilt: {
    type: Number
  },
  floor: {
    type: Number
  },
  totalFloors: {
    type: Number
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  description: {
    type: String,
    trim: true
  },
  owner: {
    name: String,
    phone: String,
    email: String
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);

