const express = require('express');
const router = express.Router();
const StockAlert = require('../models/StockAlert');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/stock-alerts - Get all alerts for user/company
router.get('/', protect, async (req, res) => {
  try {
    const alerts = await StockAlert.find({ 
      companyId: req.user.companyId,
      status: { $ne: 'resolved' } 
    }).populate('productId', 'name sku currentStock reorderLevel')
      .populate('warehouseId', 'name')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/stock-alerts/generate - Scan and generate alerts
router.post('/generate', protect, async (req, res) => {
  try {
    const { companyId } = req.user;
    const products = await Product.find({ 
      companyId, 
      isActive: true 
    });
    
    const alerts = [];
    
    for (const product of products) {
      if (product.currentStock <= product.reorderLevel) {
        const existing = await StockAlert.findOne({ 
          productId: product._id, 
          status: { $ne: 'resolved' } 
        });
        if (!existing) {
          const alert = new StockAlert({
            companyId,
            productId: product._id,
            warehouseId: product.warehouseId,
            currentStock: product.currentStock,
            reorderLevel: product.reorderLevel,
            alertType: product.currentStock === 0 ? 'out_of_stock' : 'reorder'
          });
          await alert.save();
          alerts.push(alert);
        }
      }
    }
    
    res.json({ generated: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/stock-alerts/:id/resolve - Resolve alert
router.patch('/:id/resolve', protect, async (req, res) => {
  try {
    const alert = await StockAlert.findById(req.params.id);
    if (!alert || alert.companyId.toString() !== req.user.companyId) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    alert.status = 'resolved';
    alert.resolvedBy = req.user.id;
    alert.resolvedAt = new Date();
    await alert.save();
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/stock-alerts/count - Unread count
router.get('/count', protect, async (req, res) => {
  try {
    const count = await StockAlert.countDocuments({
      companyId: req.user.companyId,
      status: 'new'
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

