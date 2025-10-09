const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const OfferLetter = require('../models/offerLetterModel');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/offerLetters'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload offer letter
router.post('/upload', upload.single('offerLetter'), async (req, res) => {
  try {
    const { fullName, moodleId, companyName } = req.body;
    const studentId = req.user ? req.user._id : null; // If using auth middleware
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/offerLetters/${req.file.filename}`;
    const offerLetter = new OfferLetter({
      studentId,
      fullName,
      moodleId,
      companyName,
      fileUrl
    });
    await offerLetter.save();
    res.status(201).json({ message: 'Offer letter uploaded', offerLetter });
  } catch (err) {
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
