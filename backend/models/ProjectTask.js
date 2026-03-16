const mongoose = require('mongoose');

const projectTaskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide task name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  assignedContractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'review', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  completedDate: {
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
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectTask'
  }],
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectTask'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProjectTask', projectTaskSchema);

