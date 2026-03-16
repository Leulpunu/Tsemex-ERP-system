const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const LeaveRequest = require('../models/LeaveRequest');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { status, employeeId } = req.query;
    if (status) query.status = status;
    if (employeeId) query.employeeId = employeeId;

    const leaveRequests = await LeaveRequest.find(query)
      .populate('employeeId', 'firstName lastName employeeId')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: leaveRequests.length, data: leaveRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('type').isIn(['annual', 'sick', 'casual', 'maternity', 'paternity', 'unpaid', 'other']).withMessage('Valid leave type is required'),
  body('startDate').isISO8601().withMessage('Start date is required'),
  body('endDate').isISO8601().withMessage('End date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const companyId = getCompanyId(req);
    const leaveRequest = await LeaveRequest.create({ ...req.body, companyId, status: 'pending' });
    res.status(201).json({ success: true, data: leaveRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, authorize('super_admin', 'company_admin', 'hr_manager'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });

    if (status) leaveRequest.status = status;
    if (remarks) leaveRequest.remarks = remarks;
    if (status) leaveRequest.approvedBy = req.user._id;
    if (status) leaveRequest.approvedDate = new Date();

    await leaveRequest.save();
    res.json({ success: true, data: leaveRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

