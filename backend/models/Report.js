const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  type: {
    type: String,
    enum: ['sales', 'inventory', 'payroll', 'project', 'financial'],
    required: true
  },
  period: {
    from: { type: Date, required: true },
    to: { type: Date, required: true }
  },
  data: { type: Object, required: true }, // Summary stats
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: String // PDF export path
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
