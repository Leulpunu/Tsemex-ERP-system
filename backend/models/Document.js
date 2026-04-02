const mongoose = require('mongoose');
const path = require('path');

const documentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Document title required'],
    trim: true,
    maxlength: [200, 'Title max 200 chars']
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['INVOICE', 'PURCHASE_ORDER', 'CONTRACT', 'CUSTOMS_DOC', 'SHIPMENT', 'RECEIPT', 'OTHER'],
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'png', 'jpg', 'jpeg', 'tiff'],
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: false // Link to invoice/customer etc
  },
  tags: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for file URL
documentSchema.virtual('fileUrl').get(function() {
  return `/uploads/documents/${this.filePath}`;
});

documentSchema.set('toJSON', { virtuals: true });
documentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Document', documentSchema);

