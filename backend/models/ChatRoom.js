const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ['direct', 'group', 'department', 'project'],
    default: 'direct'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  context: {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department'
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for fast lookups
ChatRoomSchema.index({ 'participants': 1 });
ChatRoomSchema.index({ 'context.companyId': 1 });
ChatRoomSchema.index({ 'context.departmentId': 1 });

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
