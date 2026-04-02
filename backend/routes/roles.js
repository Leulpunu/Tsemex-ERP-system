const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// GET /api/roles - Get roles for company
router.get('/', protect, async (req, res) => {
  try {
    const roles = await Role.find({ companyId: req.user.companyId })
      .sort({ level: 1, name: 1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/roles - Create role
router.post('/', protect, [
  body('name').notEmpty().trim().escape(),
  body('department').isIn(['C_SUIT', 'FINANCE', 'HR', 'SALES', 'OPERATIONS', 'CUSTOMER_SERVICE', 'PROJECT', 'IT', 'LEGAL', 'RND', 'ADMIN']),
  body('level').isInt({ min: 1, max: 4 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const role = new Role({
      ...req.body,
      companyId: req.user.companyId
    });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Role name must be unique' });
    }
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/roles/:id - Update role
router.put('/:id', protect, async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/roles/:id - Delete role (if not assigned to users)
router.delete('/:id', protect, async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    const userCount = await User.countDocuments({ roleId: req.params.id });
    if (userCount > 0) {
      return res.status(400).json({ message: 'Cannot delete role assigned to users' });
    }
    
    await role.deleteOne();
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/roles/:id/users - Get users with this role
router.get('/:id/users', protect, async (req, res) => {
  try {
    const users = await User.find({ roleId: req.params.id })
      .populate('departmentId', 'name')
      .select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/roles/:id/assign - Assign role to user
router.post('/:id/assign', protect, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user || user.companyId.toString() !== req.user.companyId) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.roleId = req.params.id;
    await user.save();
    res.json({ message: 'Role assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

