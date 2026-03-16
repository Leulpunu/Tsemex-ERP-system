const express = require('express');
const router = express.Router();
const Warehouse = require('../models/Warehouse');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const warehouses = await Warehouse.find(query).sort({ name: 1 });
    res.json({ success: true, count: warehouses.length, data: warehouses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, authorize('super_admin', 'company_admin', 'inventory_manager'), async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const warehouse = await Warehouse.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: warehouse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
    res.json({ success: true, data: warehouse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', protect, authorize('super_admin', 'company_admin'), async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
    await warehouse.deleteOne();
    res.json({ success: true, message: 'Warehouse deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

