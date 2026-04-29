const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => {
  return req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;
};

// @route   GET /api/tasks
// @desc    List tasks with optional department/status filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { departmentId, status } = req.query;
    if (departmentId) query.departmentId = departmentId;
    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('departmentId', 'name type')
      .populate('assignedTo', 'firstName lastName position')
      .populate('kpiId', 'title targetValue actualValue')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/tasks
// @desc    Create task (manager to officer breakdown)
// @access  Private
router.post('/', protect, authorize('manager', 'super_admin', 'company_admin', 'hr_manager'), async (req, res) => {
  try {
    const companyId = req.user.role === 'super_admin'
      ? (req.body.companyId || req.query.companyId)
      : req.user.companyId;
    if (!companyId) return res.status(400).json({ message: 'Company ID is required' });

    const task = await Task.create({
      ...req.body,
      companyId,
      assignedBy: req.user._id
    });
    const populated = await Task.findById(task._id)
      .populate('departmentId', 'name type')
      .populate('assignedTo', 'firstName lastName position')
      .populate('kpiId', 'title targetValue actualValue')
      .populate('assignedBy', 'name');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task status or details
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('departmentId', 'name type')
      .populate('assignedTo', 'firstName lastName position')
      .populate('kpiId', 'title targetValue actualValue')
      .populate('assignedBy', 'name');

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
