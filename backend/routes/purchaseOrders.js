const express = require('express');
const router = express.Router();
const PurchaseOrder = require('../models/PurchaseOrder');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { status, supplierId } = req.query;
    if (status) query.status = status;
    if (supplierId) query.supplierId = supplierId;

    const orders = await PurchaseOrder.find(query)
      .populate('supplierId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, authorize('super_admin', 'company_admin', 'inventory_manager'), async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const po = await PurchaseOrder.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: po });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const po = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!po) return res.status(404).json({ message: 'Purchase order not found' });
    res.json({ success: true, data: po });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

