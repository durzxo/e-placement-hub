const mongoose = require('mongoose');

// A sub-schema for the different interview rounds
const roundsSchema = new mongoose.Schema({
  aptitude: { type: String, default: 'N/A' },
  technical: { type: String, default: 'N/A' },
  hr: { type: String, default: 'N/A' },
  onlineAssessment: { type: String, default: 'N/A' },
  caseStudy: { type: String, default: 'N/A' },
  finalInterview: { type: String, default: 'N/A' },
  technicalTest: { type: String, default: 'N/A' },
  managerialRound: { type: String, default: 'N/A' },
  groupDiscussion: { type: String, default: 'N/A' },
  finalStatus: { type: String, default: 'Registered' },
}, { _id: false });

// A sub-schema for each placement activity/drive a student participates in
const placementActivitySchema = new mongoose.Schema({
  company: { type: String, required: true },
  date: { type: Date, required: true },
  rounds: roundsSchema,
  package: { type: Number, default: null }, // Package received by student for this company
}, { _id: false });

// The main schema for a student
const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  branch: { type: String, required: true },
  moodleID: { type: String, unique: true },
  cgpa: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  placementActivity: [placementActivitySchema],
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;