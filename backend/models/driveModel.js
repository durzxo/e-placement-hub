const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  driveDate: { type: Date, required: true },
  applicationDeadline: { type: Date, required: true },
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  salary: { type: String, required: true },
  jobLocation: { type: String, required: true },
  minCGPA: { type: Number, required: true, min: 0, max: 10 },
  eligibilityCriteria: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Upcoming', 'Active', 'Closed', 'Completed'],
    default: 'Upcoming'
  }
}, { timestamps: true });

const Drive = mongoose.model('Drive', driveSchema);

module.exports = Drive;