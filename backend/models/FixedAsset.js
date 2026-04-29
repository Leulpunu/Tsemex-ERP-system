const mongoose = require('mongoose');

const fixedAssetSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['machinery', 'vehicles', 'buildings', 'equipment', 'furniture', 'computers'],
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  salvageValue: {
    type: Number,
    default: 0
  },
  usefulLifeYears: {
    type: Number,
    min: 1,
    max: 50
  },
  depreciationMethod: {
    type: String,
    enum: ['straight_line', 'declining_balance', 'double_declining', 'units_of_production'],
    default: 'straight_line'
  },
  depreciationRate: Number, // Calculated
  currentBookValue: {
    type: Number,
    default: this.cost
  },
  accumulatedDepreciation: {
    type: Number,
    default: 0
  },
  depreciationAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  assetAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  location: String,
  serialNumber: String,
  warrantyExpiry: Date,
  status: {
    type: String,
    enum: ['active', 'disposed', 'retired'],
    default: 'active'
  },
  history: [{
    date: Date,
    bookValue: Number,
    depreciation: Number,
    notes: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('FixedAsset', fixedAssetSchema);

