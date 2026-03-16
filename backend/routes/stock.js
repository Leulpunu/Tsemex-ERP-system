const express = require('express');
const router = express.Router();
const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const { productId, warehouseId, type, startDate, endDate } = req.query;
    const query = companyId ? { companyId } : {};
    if (productId) query.productId = productId;
    if (warehouseId) query.warehouseId = warehouseId;
    if (type) query.type = type;
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const movements = await StockMovement.find(query)
      .populate('productId', 'name sku')
      .populate('warehouseId', 'name')
      .sort({ date: -1 });
    res.json({ success: true, count: movements.length, data: movements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/transfer', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const { productId, fromWarehouse, toWarehouse, quantity } = req.body;

    // Create outgoing movement
    await StockMovement.create({ companyId, productId, warehouseId: fromWarehouse, type: 'out', quantity, reference: 'Transfer' });
    // Create incoming movement
    await StockMovement.create({ companyId, productId, warehouseId: toWarehouse, type: 'in', quantity, reference: 'Transfer' });

    res.json({ success: true, message: 'Stock transferred successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

