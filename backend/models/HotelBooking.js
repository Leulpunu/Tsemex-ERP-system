const mongoose = require('mongoose');

const hotelBookingSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelGuest'
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelRoom',
    required: true
  },
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  guestEmail: {
    type: String,
    lowercase: true
  },
  guestPhone: {
    type: String,
    trim: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  adults: {
    type: Number,
    default: 1
  },
  children: {
    type: Number,
    default: 0
  },
  numberOfNights: {
    type: Number,
    required: true
  },
  roomRate: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  extraBedCharges: {
    type: Number,
    default: 0
  },
  otherCharges: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  balanceDue: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'online', 'other']
  },
  specialRequests: {
    type: String,
    trim: true
  },
  checkedInAt: {
    type: Date
  },
  checkedOutAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate booking number before saving
hotelBookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const count = await this.constructor.countDocuments({ companyId: this.companyId }) + 1;
    this.bookingNumber = `HTL-${year}${month}${day}-${String(count).padStart(4, '0')}`;
  }
  
  // Calculate number of nights
  if (this.checkIn && this.checkOut) {
    const nights = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
    this.numberOfNights = nights > 0 ? nights : 1;
  }
  
  next();
});

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);

