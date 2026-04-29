const express = require('express');
const router = express.Router();
const KPI = require('../models/KPI');
const { protect, authorize } = require('../middleware/auth');
const Department = require('../models/Department');
const Employee = require('../models/Employee');

// @route   GET /api/kpis
// @desc    Get all KPIs (by department or company)
router.get('/', protect, async (req, res) => {
  try {
    const { departmentId, companyId } = req.query;
    const effectiveCompanyId = req.user.role === 'super_admin' ? companyId : req.user.companyId;
    const query = effectiveCompanyId ? { companyId: effectiveCompanyId } : {};
    
    if (departmentId) query.departmentId = departmentId;
    
    // Filter by role - managers see their company departments
    if (req.user.role !== 'super_admin' && req.user.companyId) {
      const departments = await Department.find({ companyId: req.user.companyId });
      const departmentIds = departments.map(d => d._id);
      if (departmentId) {
        query.departmentId = departmentId;
      } else {
        query.departmentId = { $in: departmentIds };
      }
    }
    
    const kpis = await KPI.find(query)
      .populate('departmentId', 'name type')
      .populate('employeeId', 'firstName lastName position')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: kpis.length, data: kpis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/kpis/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const kpi = await KPI.findById(req.params.id)
      .populate('departmentId', 'name type')
      .populate('employeeId', 'firstName lastName position')
      .populate('createdBy', 'name');
    
    if (!kpi) {
      return res.status(404).json({ message: 'KPI not found' });
    }
    
    res.json({ success: true, data: kpi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/kpis
router.post('/', protect, authorize('manager', 'super_admin'), async (req, res) => {
  try {
    req.body.companyId = req.user.role === 'super_admin'
      ? (req.body.companyId || req.query.companyId)
      : req.user.companyId?.toString();
    if (!req.body.companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }
    req.body.createdBy = req.user._id;
    
    const kpi = await KPI.create(req.body);
    const populatedKpi = await KPI.findById(kpi._id)
      .populate('departmentId', 'name type')
      .populate('employeeId', 'firstName lastName position');
    
    res.status(201).json({ success: true, data: populatedKpi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/kpis/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const kpi = await KPI.findById(req.params.id);
    if (!kpi) {
      return res.status(404).json({ message: 'KPI not found' });
    }
    
    // Check permission
    if (req.user.role !== 'super_admin' && kpi.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedKpi = await KPI.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('departmentId', 'name type').populate('employeeId', 'firstName lastName position');
    
    res.json({ success: true, data: updatedKpi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

