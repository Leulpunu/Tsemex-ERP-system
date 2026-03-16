const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide work order title'],
    trim: true
  },
  workOrderNumber: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['installation', 'repair', 'maintenance', 'inspection', 'emergency', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'on_hold', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  assignedContractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor'
  },
  site: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String
  },
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
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
  estimatedHours: {
    type: Number,
    default: 0
  },
  actualHours: {
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

// Generate work order number before saving
workOrderSchema.pre('save', async function(next) {
  if (!this.workOrderNumber) {
    const prefix = 'WO';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.constructor.countDocuments({ companyId: this.companyId }) + 1;
    this.workOrderNumber = `${prefix}-${year}${month}-${String(count).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);

