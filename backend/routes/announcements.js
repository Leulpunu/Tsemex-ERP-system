const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => {
  return req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;
};

// @route   GET /api/announcements
// @desc    Get announcements / meetings for company
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { departmentId, type } = req.query;
    if (departmentId) query.departmentId = departmentId;
    if (type) query.type = type;

    const announcements = await Announcement.find(query)
      .populate('departmentId', 'name type')
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/announcements
// @desc    Create announcement / meeting note
// @access  Private
router.post('/', protect, authorize('manager', 'super_admin', 'company_admin', 'hr_manager'), async (req, res) => {
  try {
    const companyId = req.user.role === 'super_admin'
      ? (req.body.companyId || req.query.companyId)
      : req.user.companyId;
    if (!companyId) return res.status(400).json({ message: 'Company ID is required' });

    const created = await Announcement.create({
      ...req.body,
      companyId,
      createdBy: req.user._id
    });

    const populated = await Announcement.findById(created._id)
      .populate('departmentId', 'name type')
      .populate('createdBy', 'name role');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
