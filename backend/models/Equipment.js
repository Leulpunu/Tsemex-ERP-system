const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide equipment name'],
    trim: true
  },
  serialNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  model: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['electrical', 'mechanical', 'hvac', 'plumbing', 'safety', 'tools', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['operational', 'maintenance', 'repair', 'out_of_service', 'disposed'],
    default: 'operational'
  },
  location: {
    site: String,
    building: String,
    floor: String,
    room: String
  },
  purchaseDate: {
    type: Date
  },
  warrantyExpiry: {
    type: Date
  },
  purchaseCost: {
    type: Number,
    default: 0
  },
  currentValue: {
    type: Number,
    default: 0
  },
  maintenanceSchedule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
    },
    lastMaintenance: {
      type: Date
    },
    nextMaintenance: {
      type: Date
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }
  },
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Equipment', equipmentSchema);

