const express = require('express');
const router = express.Router();
const ProjectTask = require('../models/ProjectTask');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { projectId, status } = req.query;
    const query = {};
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    const tasks = await ProjectTask.find(query).populate('assignedTo', 'name').sort({ dueDate: 1 });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const task = await ProjectTask.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const task = await ProjectTask.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

