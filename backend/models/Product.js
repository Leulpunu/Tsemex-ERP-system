const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  sku: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    enum: ['pcs', 'kg', 'liter', 'meter', 'box', 'pack', 'set', 'other'],
    default: 'pcs'
  },
  minStock: {
    type: Number,
    default: 0
  },
  currentStock: {
    type: Number,
    default: 0
  },
  reorderLevel: {
    type: Number,
    default: 0
  },
  purchasePrice: {
    type: Number,
    default: 0
  },
  salePrice: {
    type: Number,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 0
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for unique SKU per company
productSchema.index({ companyId: 1, sku: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);

