const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Student = require('../models/studentModel');

// Multer setup for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// @route   GET /api/students
// @desc    Get all students from the database
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/students/upload
// @desc    Upload an Excel file and create students from it
router.post('/upload', upload.single('masterlist'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // Read the Excel file from the buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const studentsJson = xlsx.utils.sheet_to_json(worksheet);

    if (studentsJson.length === 0) {
        return res.status(400).json({ message: 'Excel file is empty or in the wrong format.' });
    }
    
    // Map the JSON data to our student schema
    const studentsToCreate = studentsJson.map(student => ({
      name: student.Name,
      rollNumber: student['Roll Number'],
      moodleID: student['Moodle ID'],
      cgpa: student.CGPA,
      branch: student.Branch,
      email: student.Email,
      phone: student.Phone,
    }));

    // Insert the students into the database
    const result = await Student.insertMany(studentsToCreate, { ordered: false });
    res.status(201).json({ message: `${result.length} students were successfully uploaded!` });

  } catch (error) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000 && error.writeErrors) {
        const successfulUploads = error.insertedDocs?.length || 0;
        return res.status(207).json({ 
            message: `Process completed. ${successfulUploads} new students uploaded. Some students were duplicates and were ignored.` 
        });
    }
    console.error(error);
    res.status(500).json({ message: 'Error processing file.' });
  }
});

module.exports = router;