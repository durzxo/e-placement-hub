const express = require('express');
const router = express.Router();
const Drive = require('../models/driveModel');
const Student = require('../models/studentModel');

// @route   POST /api/drives
// @desc    Create a new placement drive
router.post('/', async (req, res) => {
  try {
    const newDrive = new Drive({
      companyName: req.body.companyName,
      driveDate: req.body.driveDate,
      applicationDeadline: req.body.applicationDeadline,
      jobTitle: req.body.jobTitle,
      jobDescription: req.body.jobDescription,
      salary: req.body.salary,
      jobLocation: req.body.jobLocation,
      minCGPA: req.body.minCGPA,
      eligibilityCriteria: req.body.eligibilityCriteria,
      status: req.body.status,
    });

    const drive = await newDrive.save();
    res.status(201).json(drive);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/drives
// @desc    Get all placement drives
router.get('/', async (req, res) => {
    try {
        const drives = await Drive.find().sort({ driveDate: -1 });
        res.json(drives);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/drives/:id
// @desc    Get a single drive by its ID
router.get('/:id', async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.id);
        if (!drive) return res.status(404).json({ message: 'Drive not found' });
        res.json(drive);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/drives/:id/applicants
// @desc    Get all students who have applied to a specific drive
router.get('/:id/applicants', async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.id);
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        const applicants = await Student.find({
            'placementActivity.company': drive.companyName
        });
        const formattedApplicants = applicants.map(student => {
            const relevantActivity = student.placementActivity.find(activity => activity.company === drive.companyName);
            return {
                studentId: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                cgpa: student.cgpa,
                branch: student.branch,
                activity: relevantActivity,
            };
        });
        res.json(formattedApplicants);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/drives/:driveId/applicants/:studentId
// @desc    Update a student's status for a specific round in a drive
router.put('/:driveId/applicants/:studentId', async (req, res) => {
    const { roundName, status } = req.body;
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const drive = await Drive.findById(req.params.driveId);
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        const activity = student.placementActivity.find(act => act.company === drive.companyName);
        if (!activity) {
            return res.status(404).json({ message: 'Student is not enrolled in this drive' });
        }
        if (activity.rounds[roundName] !== undefined) {
            activity.rounds[roundName] = status;
        } else {
            return res.status(400).json({ message: 'Invalid round name' });
        }
        await student.save();
        res.json(student);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;