const mongoose = require('mongoose');

const permissionsTemplate = {
  dashboard: { executive: false, departmental: false, operational: false, custom: false, export: false },
  finance: {
    ledger: { c: false, r: false, u: false, d: false, a: false },
    payable: { c: false, r: false, u: false, d: false, a: false },
    receivable: { c: false, r: false, u: false, d: false, a: false },
    budget: { c: false, r: false, u: false, d: false, a: false },
    treasury: { c: false, r: false, u: false, d: false, a: false },
    reporting: { c: false, r: false, u: false, d: false, a: false }
  },
  hr: {
    employee: { c: false, r: false, u: false, d: false, a: false },
    recruitment: { c: false, r: false, u: false, d: false, a: false },
    training: { c: false, r: false, u: false, d: false, a: false },
    performance: { c: false, r: false, u: false, d: false, a: false },
    payroll: { c: false, r: false, u: false, d: false, a: false },
    leave: { c: false, r: false, u: false, d: false, a: false }
  },
  sales: {
    leads: { c: false, r: false, u: false, d: false, a: false },
    pipeline: { c: false, r: false, u: false, d: false, a: false },
    customer: { c: false, r: false, u: false, d: false, a: false },
    campaigns: { c: false, r: false, u: false, d: false, a: false },
    orders: { c: false, r: false, u: false, d: false, a: false }
  },
  operations: {
    inventory: { c: false, r: false, u: false, d: false, a: false },
    procurement: { c: false, r: false, u: false, d: false, a: false },
    supplier: { c: false, r: false, u: false, d: false, a: false },
    production: { c: false, r: false, u: false, d: false, a: false },
    logistics: { c: false, r: false, u: false, d: false, a: false }
  },
  customer_service: {
    tickets: { c: false, r: false, u: false, d: false, a: false },
    sla: { c: false, r: false, u: false, d: false, a: false },
    feedback: { c: false, r: false, u: false, d: false, a: false }
  },
  project: {
    project: { c: false, r: false, u: false, d: false, a: false },
    task: { c: false, r: false, u: false, d: false, a: false },
    budget: { c: false, r: false, u: false, d: false, a: false }
  },
  it: { users: { c: false, r: false, u: false, d: false, a: false }, roles: { c: false, r: false, u: false, d: false, a: false } },
  legal: { contracts: { c: false, r: false, u: false, d: false, a: false }, compliance: { c: false, r: false, u: false, d: false, a: false } },
  document: { upload: false, view: false, edit: false, delete: false }
};

const roleSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    enum: ['C_SUIT', 'FINANCE', 'HR', 'SALES', 'OPERATIONS', 'CUSTOMER_SERVICE', 'PROJECT', 'IT', 'LEGAL', 'RND', 'ADMIN'],
    required: true
  },
  level: {
    type: Number,
    min: 1,
    max: 4,
    required: true
  },
  permissions: {
    type: Object,
    default: permissionsTemplate
  },
  dataScope: {
    type: String,
    enum: ['self', 'team', 'department', 'cross_department', 'enterprise', 'company'],
    default: 'self'
  },
  approvalLimit: {
    type: Number,
    default: 0  // USD threshold for self-approval
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);

