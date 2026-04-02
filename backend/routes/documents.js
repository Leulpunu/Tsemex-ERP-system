const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const { protect, authorize } = require('../middleware/auth');
const { AppError } = require('../utils/errorResponse');

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/documents');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|png|jpg|jpeg|tiff/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new AppError('Invalid file type. Only PDF/images allowed', 400));
  }
});

// @route   GET /api/documents
// @desc    Get company documents
router.get('/', protect, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = { companyId: req.user.companyId };
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const documents = await Document.find(query)
      .populate('uploadedBy', 'name')
      .populate('companyId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Document.countDocuments(query);

    res.json({
      success: true,
      count,
      data: documents,
      pagination: { page, limit, pages: Math.ceil(count / limit) }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/documents
// @desc    Upload document
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const documentData = {
      companyId: req.user.companyId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      fileName: req.file.filename,
      filePath: req.file.filename,
      fileType: req.file.mimetype.split('/')[1],
      fileSize: req.file.size,
      uploadedBy: req.user._id
    };

    const document = await Document.create(documentData);
    const populatedDoc = await Document.findById(document._id)
      .populate('uploadedBy', 'name');

    res.status(201).json({ success: true, data: populatedDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/documents/:id
// @desc    Get single document
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      companyId: req.user.companyId
    }).populate('uploadedBy', 'name');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ success: true, data: document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document
router.delete('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      companyId: req.user.companyId
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file
    const filePath = path.join(__dirname, '../uploads/documents', document.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Document.findByIdAndDelete(document._id);

    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

