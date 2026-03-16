const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Get company ID from user
const getCompanyId = (req) => {
  return req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;
};

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    
    const employees = await Employee.find(query)
      .populate('departmentId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/employees/:id
// @desc    Get single employee
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('departmentId', 'name');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ success: true, data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/employees
// @desc    Create an employee
// @access  Private
router.post('/', protect, authorize('super_admin', 'company_admin', 'hr_manager'), [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('joinDate').isISO8601().withMessage('Join date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const companyId = getCompanyId(req);
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    const employeeData = { ...req.body, companyId };
    const employee = await Employee.create(employeeData);

    // Create user account for employee
    const user = await User.create({
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      password: 'password123', // Default password - should be changed
      phone: employee.phone,
      companyId,
      role: 'employee'
    });

    // Link user to employee
    employee.userId = user._id;
    await employee.save();

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update an employee
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
// @access  Private
router.delete('/:id', protect, authorize('super_admin', 'company_admin'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.deleteOne();
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

