const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  workOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkOrder'
  },
  type: {
    type: String,
    enum: ['preventive', 'corrective', 'predictive', 'emergency', 'inspection'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  performedByContractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor'
  },
  scheduledDate: {
    type: Date
  },
  startDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  laborHours: {
    type: Number,
    default: 0
  },
  laborCost: {
    type: Number,
    default: 0
  },
  materialCost: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  parts: [{
    name: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  notes: {
    type: String,
    trim: true
  },
  attachments: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);

