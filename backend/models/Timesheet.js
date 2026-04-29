const mongoose = require('mongoose');

const timesheetEntrySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  date: {
    type: Date,
    required: true
  },
  hours: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  rate: {
    type: Number,
    default: 0
  },
  total: {
    type: Number
  },
  description: String,
  billable: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'billed'],
    default: 'draft'
  }
});

const timesheetSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  period: {
    from: { type: Date, required: true },
    to: { type: Date, required: true }
  },
  entries: [timesheetEntrySchema],
  totalHours: Number,
  totalBillable: Number,
  glPosted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Timesheet', timesheetSchema);
