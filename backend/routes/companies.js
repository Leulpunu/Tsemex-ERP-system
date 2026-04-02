const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const Branch = require('../models/Branch');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/companies/public
// @desc    Get all companies (public access for initial load)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const companies = await Company.find({})
      .select('name type email phone address')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/companies
// @desc    Get all companies
// @access  Private (Super Admin only)
router.get('/', protect, authorize('super_admin'), async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/companies/:id
// @desc    Get single company
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/companies
// @desc    Create a company
// @access  Private (Super Admin only)
router.post('/', protect, authorize('super_admin'), [
  body('name').notEmpty().withMessage('Company name is required'),
  body('type').isIn(['construction', 'electro_mechanical', 'import_export', 'real_estate_hotel']).withMessage('Valid company type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/companies/:id
// @desc    Update a company
// @access  Private (Super Admin or Company Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    let company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check permission
    if (req.user.role !== 'super_admin' && req.user.companyId.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this company' });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/companies/:id
// @desc    Delete a company
// @access  Private (Super Admin only)
router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.deleteOne();
    res.json({ success: true, message: 'Company deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/companies/:id/branches
// @desc    Get company branches
// @access  Private
router.get('/:id/branches', protect, async (req, res) => {
  try {
    const branches = await Branch.find({ companyId: req.params.id });
    res.json({ success: true, count: branches.length, data: branches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/companies/:id/branches
// @desc    Create a branch
// @access  Private
router.post('/:id/branches', protect, async (req, res) => {
  try {
    req.body.companyId = req.params.id;
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, data: branch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/companies/:id/users
// @desc    Get company users
// @access  Private
router.get('/:id/users', protect, async (req, res) => {
  try {
    const users = await User.find({ companyId: req.params.id }).select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

