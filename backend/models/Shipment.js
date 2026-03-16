const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  shipmentNumber: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    enum: ['import', 'export', 'transit'],
    required: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  origin: {
    country: String,
    city: String,
    port: String,
    address: String
  },
  destination: {
    country: String,
    city: String,
    port: String,
    address: String
  },
  status: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', ' customs_clearance', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  carrier: {
    type: String,
    trim: true
  },
  shipmentDate: {
    type: Date
  },
  estimatedArrival: {
    type: Date
  },
  actualArrival: {
    type: Date
  },
  weight: {
    type: Number
  },
  volume: {
    type: Number
  },
  packages: {
    type: Number,
    default: 1
  },
  description: {
    type: String,
    trim: true
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    description: String,
    quantity: Number,
    unit: String,
    value: Number
  }],
  freightCost: {
    type: Number,
    default: 0
  },
  insuranceCost: {
    type: Number,
    default: 0
  },
  otherCost: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
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

// Generate shipment number before validation/save
shipmentSchema.pre('validate', async function(next) {
  if (!this.shipmentNumber) {
    const prefix = this.type === 'import' ? 'IMP' : this.type === 'export' ? 'EXP' : 'TRN';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.constructor.countDocuments({ companyId: this.companyId }) + 1;
    this.shipmentNumber = `${prefix}-${year}${month}-${String(count).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);

