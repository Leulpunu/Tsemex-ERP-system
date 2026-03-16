const mongoose = require('mongoose');

const hotelRoomSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  floor: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['standard', 'deluxe', 'suite', 'presidential', 'family', 'twin', 'single', 'double'],
    required: true
  },
  category: {
    type: String,
    enum: ['standard', 'premium', 'luxury'],
    default: 'standard'
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance', 'cleaning', 'out_of_order'],
    default: 'available'
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  weekendPrice: {
    type: Number,
    default: 0
  },
  peakPrice: {
    type: Number,
    default: 0
  },
  capacity: {
    adults: { type: Number, default: 2 },
    children: { type: Number, default: 1 }
  },
  bedType: {
    type: String,
    enum: ['single', 'double', 'twin', 'king', 'queen'],
    default: 'double'
  },
  amenities: [{
    type: String
  }],
  size: {
    value: Number,
    unit: { type: String, default: 'sqft' }
  },
  view: {
    type: String,
    enum: ['city', 'sea', 'mountain', 'garden', 'pool', 'none'],
    default: 'none'
  },
  smoking: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String
  }],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index for unique room number per company
hotelRoomSchema.index({ companyId: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('HotelRoom', hotelRoomSchema);

