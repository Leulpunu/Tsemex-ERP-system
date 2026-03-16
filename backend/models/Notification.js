const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'approval', 'reminder'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true // e.g. invoiceId, leaveId
  },
  relatedType: {
    type: String,
    required: true // 'invoice', 'leave', etc.
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
