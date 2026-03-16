const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { month, year, employeeId } = req.query;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (employeeId) query.employeeId = employeeId;

    const payroll = await Payroll.find(query)
      .populate('employeeId', 'firstName lastName employeeId basicSalary')
      .sort({ year: -1, month: -1 });
    res.json({ success: true, count: payroll.length, data: payroll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, authorize('super_admin', 'company_admin', 'hr_manager', 'accountant'), async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;
    
    const netSalary = basicSalary + (allowances || 0) - (deductions || 0);
    
    const payroll = await Payroll.create({
      employeeId, month, year, basicSalary, 
      allowances: allowances || 0, 
      deductions: deductions || 0, 
      netSalary, companyId
    });
    
    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/summary', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const { month, year } = req.query;
    
    const query = companyId ? { companyId } : {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const summary = await Payroll.aggregate([
      { $match: query },
      { $group: { _id: null, totalBasic: { $sum: '$basicSalary' }, totalAllowances: { $sum: '$allowances' }, totalDeductions: { $sum: '$deductions' }, totalNet: { $sum: '$netSalary' }, count: { $sum: 1 } } }
    ]);

    res.json({ success: true, data: summary[0] || { totalBasic: 0, totalAllowances: 0, totalDeductions: 0, totalNet: 0, count: 0 } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

