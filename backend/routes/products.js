const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const query = companyId ? { companyId } : {};
    const { category, warehouseId, lowStock } = req.query;
    if (category) query.category = category;
    if (warehouseId) query['warehouses.warehouse'] = warehouseId;
    if (lowStock === 'true') query.$expr = { $lte: ['$currentStock', '$minStock'] };

    const products = await Product.find(query).sort({ name: 1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, authorize('super_admin', 'company_admin', 'inventory_manager'), async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const product = await Product.create({ ...req.body, companyId });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', protect, authorize('super_admin', 'company_admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

