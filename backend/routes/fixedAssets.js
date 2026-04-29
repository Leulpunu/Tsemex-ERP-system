const express = require('express');
const router = express.Router();
const FixedAsset = require('../models/FixedAsset');
const Transaction = require('../models/Transaction');
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const getCompanyId = (req) => req.user.role === 'super_admin' ? req.query.companyId : req.user.companyId;

// GET /api/fixed-assets - List
router.get('/', protect, async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const assets = await FixedAsset.find({ companyId }).sort({ purchaseDate: -1 });
    res.json({ success: true, count: assets.length, data: assets });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/fixed-assets - Create asset
router.post('/', protect, authorize('company_admin', 'accountant'), [
  body('name').notEmpty(),
  body('cost').isFloat({ min: 0 }),
  body('usefulLifeYears').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const companyId = getCompanyId(req);
    const { usefulLifeYears, cost, salvageValue = 0, depreciationMethod = 'straight_line' } = req.body;

    const depreciationRate = depreciationMethod === 'straight_line' 
      ? 100 / usefulLifeYears 
      : 20; // Default double declining

    const asset = await FixedAsset.create({ 
      ...req.body, 
      companyId, 
      depreciationRate,
      currentBookValue: cost - salvageValue
    });

    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/fixed-assets/:id/depreciate - Post depreciation
router.post('/:id/depreciate', protect, authorize('accountant'), async (req, res) => {
  try {
    const asset = await FixedAsset.findById(req.params.id);
    if (!asset || asset.status !== 'active') return res.status(400).json({ message: 'Cannot depreciate' });

    const depreciationAmount = asset.depreciationRate / 100 * asset.currentBookValue;
    const newBookValue = asset.currentBookValue - depreciationAmount;

    // Create depreciation transaction
    await Transaction.create({
      companyId: asset.companyId,
      description: `Depreciation - ${asset.name}`,
      amount: depreciationAmount,
      type: 'debit',
      category: 'depreciation_expense'
    });

    asset.accumulatedDepreciation += depreciationAmount;
    asset.currentBookValue = newBookValue;
    asset.history.push({
      date: new Date(),
      bookValue: newBookValue,
      depreciation: depreciationAmount,
      notes: 'Annual depreciation'
    });

    if (newBookValue <= 0) asset.status = 'retired';

    await asset.save();

    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

