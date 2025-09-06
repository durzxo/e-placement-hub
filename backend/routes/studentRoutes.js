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

    for (const studentData of studentsJson) {
      // Find or create the student
      const student = await Student.findOneAndUpdate(
        { rollNumber: studentData['Roll Number'] },
        {
          name: studentData.Name,
          moodleID: studentData['Moodle ID'],
          cgpa: studentData.CGPA,
          branch: studentData.Branch,
          email: studentData.Email,
          phone: studentData.Phone,
        },
        { upsert: true, new: true } // upsert: create if not found
      );
      studentsAdded++;

      // Now, handle the company enrollments
      if (studentData.Companies) {
        const companyNames = studentData.Companies.split(',').map(name => name.trim());
        
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