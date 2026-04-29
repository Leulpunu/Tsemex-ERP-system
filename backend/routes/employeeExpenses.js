const express = require('express');
const router = express.Router();
const EmployeeExpense = require('../models/EmployeeExpense');
const Employee = require('../models/Employee');
const { protect, authorize, hasModulePermission } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = { companyId };
    const { employeeId, status, from, to } = req.query;
    if (employeeId) query.employeeId = employeeId;
    if (status) query.status = status;
    if (from && to) query.date = { $gte: new Date(from), $lte: new Date(to) };

    const expenses = await EmployeeExpense.find(query)
      .populate('employeeId', 'firstName lastName employeeId')
      .populate('approvedBy', 'name')
      .sort({ date: -1 });
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    if (!hasModulePermission(req.user, 'hr', 'expenses', 'c')) {
      return res.status(403).json({ message: 'No permission' });
    }
    const companyId = getCompanyId(req);
    const expense = await EmployeeExpense.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id/approve', protect, authorize('super_admin', 'company_admin'), async (req, res) => {
  try {
    const expense = await EmployeeExpense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    
    expense.status = 'approved';
    expense.approvedBy = req.user._id;
    await expense.save();
    
    res.json({ success: true, data: expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
