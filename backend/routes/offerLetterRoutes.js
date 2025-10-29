const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const OfferLetter = require('../models/offerLetterModel');

const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/offerLetters');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload offer letter
router.post('/upload', upload.single('offerLetter'), async (req, res) => {
  try {
    const { fullName, moodleId, companyName } = req.body;
    const studentId = req.user ? req.user._id : null; // If using auth middleware
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    if (!fullName || !moodleId || !companyName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const fileUrl = `/uploads/offerLetters/${req.file.filename}`;
    console.log('Saving offer letter with fileUrl:', fileUrl);
    
    const offerLetter = new OfferLetter({
      studentId,
      fullName,
      moodleId,
      companyName,
      fileUrl
    });
    
    await offerLetter.save();
    res.status(201).json({ message: 'Offer letter uploaded successfully', offerLetter });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// Get offer letters for a company
router.get('/company/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    const letters = await OfferLetter.find({ companyName });
    res.json(letters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offer letters', error: err.message });
  }
});

// Get offer letter for a student
router.get('/student/:moodleId', async (req, res) => {
  try {
    const { moodleId } = req.params;
    const letter = await OfferLetter.findOne({ moodleId });
    res.json(letter);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offer letter', error: err.message });
  }
});

module.exports = router;
