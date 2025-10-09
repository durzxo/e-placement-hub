// backend/routes/driveRoutes.js (FINAL VERSION)

const express = require('express');
const router = express.Router();
const Drive = require('../models/driveModel');
const Student = require('../models/studentModel');
const axios = require('axios'); // For calling the ML service

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
// @desc    Get all placement drives WITH student count (MODIFIED)
router.get('/', async (req, res) => {
    try {
        // 1. Find all drives
        const drives = await Drive.find().sort({ driveDate: -1 });

        // 2. Create an array of promises to count applicants for each drive
        const drivesWithCountPromises = drives.map(async (drive) => {
            // Count students where the company name is in their placement activity
            const applicantCount = await Student.countDocuments({
                'placementActivity.company': drive.companyName
            });
            
            // Return a new object combining drive data and the count
            return {
                ...drive.toObject(), // Convert mongoose document to plain JS object
                applicantCount: applicantCount
            };
        });

        // 3. Resolve all promises concurrently
        const drivesWithCount = await Promise.all(drivesWithCountPromises);
        
        res.json(drivesWithCount);
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

// @route   DELETE /api/drives/:id
// @desc    Delete a drive
router.delete('/:id', async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.id);
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }

        // Remove the drive using findByIdAndDelete
        await Drive.findByIdAndDelete(req.params.id);

        res.json({ message: 'Drive removed successfully' });
    } catch (error) {
        console.error('Error deleting drive:', error);
        res.status(500).json({ message: 'Failed to delete drive', error: error.message });
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


// @route   POST /api/drives/predict
// @desc    Predict placement probability for a student in a drive (Calls Python ML Service)
router.post('/predict', async (req, res) => {
    const { studentId, driveId } = req.body;
    
    try {
        // 1. Fetch necessary data from MongoDB
        const student = await Student.findById(studentId);
        const drive = await Drive.findById(driveId);
        
        if (!student || !drive) {
            return res.status(404).json({ message: 'Student or Drive not found' });
        }
        
        // Count rounds cleared across all activities (Simplified logic for the ML demo)
        const totalRoundsCleared = student.placementActivity.reduce((count, activity) => {
            let clearedInActivity = 0;
            // Count rounds with 'Cleared' status
            for (const key in activity.rounds) {
                if (activity.rounds[key] === 'Cleared') {
                    clearedInActivity++;
                }
            }
            return count + clearedInActivity;
        }, 0);

        // 2. Prepare the payload with simplified features for the Python service
        const mlPayload = {
            student_cgpa: student.cgpa,
            student_rounds_cleared: totalRoundsCleared, 
            drive_min_cgpa: drive.minCGPA 
        };

        // 3. Call the Python ML Microservice (running on port 8000)
        const mlResponse = await axios.post('http://localhost:8000/predict', mlPayload);
        
        // 4. Return the prediction score/data from the Python service
        res.json(mlResponse.data);

    } catch (error) {
        console.error('Prediction Error:', error.message);
        res.status(503).json({ 
            message: 'ML Service Unavailable or Prediction Failed',
            detail: error.code === 'ECONNREFUSED' ? 'Could not connect to Python service on port 8000.' : error.message
        });
    }
});

module.exports = router;

// @route   GET /api/drives/:id/round-status
// @desc    Get round-wise student status for a drive
router.get('/:id/round-status', async (req, res) => {
        console.log('Drive companyName:', drive.companyName);
        console.log('Applicants found:', applicants.length);
        applicants.forEach(student => {
            const activity = student.placementActivity.find(a => a.company === drive.companyName);
            console.log('Student:', student.name, '| Company:', activity ? activity.company : 'No activity');
            if (activity) {
                Object.entries(activity.rounds).forEach(([round, status]) => {
                    console.log('  Round:', round, '| Status:', status);
                });
            }
        });
    try {
        const drive = await Drive.findById(req.params.id);
        if (!drive) return res.status(404).json({ message: 'Drive not found' });
        const applicants = await Student.find({ 'placementActivity.company': drive.companyName });
        // Use fixed round names to match frontend
        const roundNames = [
            'aptitude', 'technical', 'hr', 'onlineAssessment', 'caseStudy',
            'finalInterview', 'technicalTest', 'managerialRound', 'groupDiscussion', 'finalStatus'
        ];
        const result = {};
        roundNames.forEach(round => {
            result[round] = {};
        });
        applicants.forEach(student => {
            const activity = student.placementActivity.find(a => a.company === drive.companyName);
            if (!activity) return;
            roundNames.forEach(round => {
                if (activity.rounds && Object.prototype.hasOwnProperty.call(activity.rounds, round)) {
                    const status = activity.rounds[round] || 'N/A';
                    if (!result[round][status]) result[round][status] = [];
                    result[round][status].push({
                        studentId: student._id,
                        name: student.name,
                        rollNumber: student.rollNumber,
                        email: student.email,
                        branch: student.branch,
                        cgpa: student.cgpa
                    });
                }
            });
        });
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});