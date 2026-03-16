const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide project name'],
    trim: true
  },
  projectCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  client: {
    name: String,
    contact: String,
    email: String,
    phone: String,
    address: String
  },
  description: {
    type: String,
    trim: true
  },
  budget: {
    type: Number,
    default: 0
  },
  actualCost: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  contractDocument: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Generate project code before saving
projectSchema.pre('save', async function(next) {
  if (!this.projectCode) {
    const company = await mongoose.model('Company').findById(this.companyId);
    const prefix = company ? company.name.substring(0, 3).toUpperCase() : 'PRJ';
    const count = await this.constructor.countDocuments({ companyId: this.companyId }) + 1;
    this.projectCode = `${prefix}-${String(count).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);

