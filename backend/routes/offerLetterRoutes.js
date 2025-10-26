const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const OfferLetter = require('../models/offerLetterModel');
const Student = require('../models/studentModel');

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
    // Try to link to an existing Student by moodleID, rollNumber or email (tolerant)
    let studentId = req.user ? req.user._id : null; // If auth middleware provides user
    let studentRollNumber = null;
    if (!studentId && moodleId) {
      const student = await Student.findOne({
        $or: [
          { moodleID: moodleId },
          { rollNumber: moodleId },
          { email: moodleId }
        ]
      }).lean();
      if (student) {
        studentId = student._id;
        studentRollNumber = student.rollNumber;
      }
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/offerLetters/${req.file.filename}`;
    const offerLetter = new OfferLetter({
      studentId,
      fullName,
      moodleId,
      rollNumber: studentRollNumber,
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
    // Case-insensitive exact match for company name to avoid small differences in casing/spacing
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&');
    const letters = await OfferLetter.find({ companyName: { $regex: `^${escapeRegExp(companyName)}$`, $options: 'i' } });
    res.json(letters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offer letters', error: err.message });
  }
});

// Get offer letter for a student
router.get('/student/:moodleId', async (req, res) => {
  try {
    const { moodleId } = req.params;
    // Try multiple ways to find an offer letter: moodleId exact, fullName exact, or case-insensitive matches
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&');
    const letter = await OfferLetter.findOne({
      $or: [
        { moodleId },
        { fullName: moodleId },
        { moodleId: { $regex: `^${escapeRegExp(moodleId)}$`, $options: 'i' } },
        { fullName: { $regex: `^${escapeRegExp(moodleId)}$`, $options: 'i' } }
      ]
    });
    res.json(letter);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offer letter', error: err.message });
  }
});

module.exports = router;
