const express = require('express');
const router = express.Router();
const WorkOrder = require('../models/WorkOrder');
const { protect } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { status, priority } = req.query;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    const workOrders = await WorkOrder.find(query).populate('assignedTo', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: workOrders });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const workOrder = await WorkOrder.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: workOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!workOrder) return res.status(404).json({ message: 'Work order not found' });
    res.json({ success: true, data: workOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

