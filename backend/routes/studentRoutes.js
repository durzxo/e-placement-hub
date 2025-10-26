const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Student = require('../models/studentModel');
const Drive = require('../models/driveModel'); // We need the Drive model to find drives

const upload = multer({ storage: multer.memoryStorage() });

// @route   GET /api/students
// @desc    Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/students/upload
// @desc    Upload an Excel file to create/update students and enroll them in drives
router.post('/upload', upload.single('masterlist'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const studentsJson = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let studentsAdded = 0;
    let enrollments = 0;

    // Helper: try multiple possible header names and also tolerant lookup
    const getField = (row, candidates = []) => {
      if (!row) return undefined;
      // direct match first
      for (const c of candidates) {
        if (Object.prototype.hasOwnProperty.call(row, c)) return row[c];
      }
      // normalized lookup: lowercase and remove non-alphanumeric
      const normMap = {};
      for (const k of Object.keys(row)) {
        const nk = k.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
        normMap[nk] = row[k];
      }
      for (const c of candidates) {
        const nk = c.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
        if (nk in normMap) return normMap[nk];
      }
      return undefined;
    };

    for (const studentData of studentsJson) {
      // Map headers: accept old and new header names
      const rollNumber = getField(studentData, ['Roll Number', 'Superset ID', 'RollNumber', 'SupersetID']);
      const name = getField(studentData, ['Name', 'Full Name']);
      const moodleID = getField(studentData, ['Moodle ID', 'Roll No', 'RollNo', 'MoodleID']);
      const cgpa = getField(studentData, ['CGPA', 'Cgpa']);
      const branch = getField(studentData, ['Branch', 'Current Course', 'Current Course Program', 'Curent Course', 'CurrentCourseProgram']);
      const email = getField(studentData, ['Email', 'Email Id', 'Email ID', 'EmailId']);
      const phone = getField(studentData, ['Phone', 'Phone Number', 'PhoneNumber']);

      // Find or create the student using the normalized fields
      const student = await Student.findOneAndUpdate(
        { rollNumber: rollNumber },
        {
          name: name,
          moodleID: moodleID,
          cgpa: cgpa,
          branch: branch,
          email: email,
          phone: phone,
        },
        { upsert: true, new: true } // upsert: create if not found
      );
      studentsAdded++;

      // Now, handle the company enrollments (accept Companies or Companies Applied)
      const companiesField = getField(studentData, ['Companies', 'Company', 'Companies Applied', 'Applied Companies']);
      if (companiesField) {
        // accept comma or semicolon separated lists
        const companyNames = companiesField.toString().split(/[,;]+/).map(name => name.trim()).filter(Boolean);
        
        for (const companyName of companyNames) {
          const drive = await Drive.findOne({ companyName: companyName });
          if (drive) {
            // Check if the student is already enrolled in this drive to avoid duplicates
            const isAlreadyEnrolled = student.placementActivity.some(activity => activity.company === companyName);

            if (!isAlreadyEnrolled) {
              student.placementActivity.push({
                company: drive.companyName,
                date: drive.driveDate,
                // Default round statuses
                rounds: { finalStatus: 'Registered' } 
              });
              enrollments++;
            }
          }
        }
        await student.save();
      }
    }

    res.status(201).json({ 
      message: `Upload complete. Processed ${studentsAdded} students and created ${enrollments} new drive enrollments.`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing file.' });
  }
});

module.exports = router;