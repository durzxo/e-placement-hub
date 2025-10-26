const mongoose = require('mongoose');

const offerLetterSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  fullName: { type: String, required: true },
  moodleId: { type: String, required: true },
  rollNumber: { type: String }, // Superset ID / Roll Number, linked when possible
  companyName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const OfferLetter = mongoose.model('OfferLetter', offerLetterSchema);

module.exports = OfferLetter;
