const mongoose = require('mongoose');

const customsDocSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
    required: true
  },
  type: {
    type: String,
    enum: ['bill_of_lading', 'commercial_invoice', 'packing_list', 'certificate_of_origin', 'customs_declaration', 'import_license', 'other'],
    required: true
  },
  documentNumber: {
    type: String,
    trim: true
  },
  issueDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  filedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'approved', 'rejected', 'expired'],
    default: 'pending'
  },
  issuingAuthority: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fileUrl: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomsDoc', customsDocSchema);

