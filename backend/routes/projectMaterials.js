const express = require('express');
const router = express.Router();
const ProjectMaterial = require('../models/ProjectMaterial');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { projectId } = req.query;
    const query = projectId ? { projectId } : {};
    const materials = await ProjectMaterial.find(query).populate('productId', 'name');
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const material = await ProjectMaterial.create(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

