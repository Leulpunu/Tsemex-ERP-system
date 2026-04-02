const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Department = require('../models/Department');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => {
  return req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;
};

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const departments = await Department.find(query).sort({ name: 1 });
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json({ success: true, data: department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, authorize('super_admin', 'company_admin', 'hr_manager'), [
  body('name').notEmpty().withMessage('Department name is required'),
  body('type').isIn(['FINANCE', 'HR', 'SALES', 'OPERATIONS', 'CUSTOMER_SERVICE', 'PROJECT', 'IT', 'LEGAL', 'RND', 'ADMIN']).withMessage('Valid department type required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const companyId = getCompanyId(req);
    if (!companyId) return res.status(400).json({ message: 'Company ID is required' });

    const department = await Department.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.put('/:id', protect, async (req, res) => {
  try {
    let department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', protect, authorize('super_admin', 'company_admin'), async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    await department.deleteOne();
    res.json({ success: true, message: 'Department deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

