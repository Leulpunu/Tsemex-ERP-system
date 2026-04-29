const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Company = require('../models/Company');
const Role = require('../models/Role');
const { protect } = require('../middleware/auth');

// Generate Tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
  return { accessToken };
};

// MFA utils
const { generateMFASecret, generateQRCode } = require('../utils/mfa');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, companyId, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // If companyId is provided, verify it exists
    if (companyId) {
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(400).json({ message: 'Company not found' });
      }
    }

    // Auto-assign roleId if not provided
    let roleId = req.body.roleId;
    if (!roleId) {
      const defaultRole = await Role.findOne({ name: 'employee' }) || await Role.findOne();
      if (!defaultRole) {
        return res.status(400).json({ message: 'No roles configured. Please contact administrator.' });
      }
      roleId = defaultRole._id;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      companyId,
      role: role || 'employee',
      roleId,
      departmentId: req.body.departmentId,
      rank: req.body.rank
    });

    const { otpauth_url } = generateMFASecret();
    user.mfaSecret = otpauth_url;
    await user.save();

    const qrCode = await generateQRCode(otpauth_url);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        mfaRequired: true,
        mfaQR: qrCode
      },
      token: generateTokens(user._id).accessToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // MFA required if enabled
    if (user.mfaSecret) {
      const { otpauth_url } = generateMFASecret();
      const qrCode = await generateQRCode(otpauth_url);
      return res.json({
        success: true,
        mfaRequired: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        mfaQR: qrCode
      });
    }

    // Get company details
    let company = null;
    if (user.companyId) {
      company = await Company.findById(user.companyId);
    }

    const tokens = generateTokens(user._id);
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyId: user.companyId,
        company: company,
        lastLogin: user.lastLogin,
        mfaEnabled: !!user.mfaSecret
      },
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    let company = null;
    if (user.companyId) {
      company = await Company.findById(user.companyId);
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyId: user.companyId,
        company: company,
        isActive: user.isActive,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/auth/password
// @desc    Update password
// @access  Private
router.put('/password', protect, [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

