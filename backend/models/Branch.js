const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide branch name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Branch', branchSchema);

