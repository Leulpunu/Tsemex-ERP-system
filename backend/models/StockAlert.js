const mongoose = require('mongoose');

const stockAlertSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  },
  currentStock: {
    type: Number,
    required: true
  },
  reorderLevel: {
    type: Number,
    required: true
  },
  alertType: {
    type: String,
    enum: ['low_stock', 'reorder', 'out_of_stock'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'resolved'],
    default: 'new'
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  notifiedUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('StockAlert', stockAlertSchema);

