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

    // Normalize empty values coming from the client (selects often send "").
    const cleanedBody = { ...req.body };

    // employeeId is derived in the model pre('save')
    // Ensure empty string/undefined never reaches Mongoose.
    if (cleanedBody.employeeId === '' || cleanedBody.employeeId === undefined) {
      delete cleanedBody.employeeId
    }

    // departmentId is ObjectId; never allow empty string to be cast.
    if (cleanedBody.departmentId === '' || cleanedBody.departmentId === undefined) {
      delete cleanedBody.departmentId
    }

    // roleId is ObjectId; never allow empty string to be cast.
    if (cleanedBody.roleId === '' || cleanedBody.roleId === undefined) {
      delete cleanedBody.roleId
    }



    const employeeData = { ...cleanedBody, companyId };

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

    // Prevent client from sending invalid immutable/derived fields.
    // employeeId is generated in the Employee model pre('save'), and is required.
    // If employeeId is missing in payload, mongoose will generate it automatically on save.
    if (req.body.employeeId === undefined) {
      // no-op; keep missing so pre-save can generate
    } else if (req.body.employeeId === '') {
      delete req.body.employeeId
    }

    // Use findOneAndUpdate with runValidators; pre-save hooks won't run on update.
    // Ensure employeeId is not required to be supplied by the client on update.
    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, context: 'query' });
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

