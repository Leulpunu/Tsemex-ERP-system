const mongoose = require('mongoose');

const hotelGuestSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
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
  country: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  idType: {
    type: String,
    enum: ['passport', 'national_id', 'driving_license', 'other']
  },
  idNumber: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  company: {
    type: String,
    trim: true
  },
  designation: {
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
  totalStays: {
    type: Number,
    default: 0
  },
  totalNights: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  preferences: {
    roomType: String,
    bedType: String,
    floor: String,
    amenities: [String]
  },
  notes: {
    type: String,
    trim: true
  },
  isBlacklisted: {
    type: Boolean,
    default: false
  },
  blacklistReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for full name
hotelGuestSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('HotelGuest', hotelGuestSchema);

