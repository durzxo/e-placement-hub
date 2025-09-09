const express = require('express');
const router = express.Router();
const Student = require('../models/studentModel');
const Drive = require('../models/driveModel');

// @route   GET /api/dashboard/stats
// @desc    Get all statistics for the main dashboard
router.get('/stats', async (req, res) => {
  try {
    // 1. Get total number of students
    const totalStudents = await Student.countDocuments();

    // 2. Get number of active drives
    const activeDrives = await Drive.countDocuments({ status: 'Active' });

    // 3. Get number of students who have been selected in at least one drive
    const totalSelected = await Student.countDocuments({
      'placementActivity.rounds.finalStatus': 'Selected'
    });
    
    // 4. Calculate placement rate
    const placementRate = totalStudents > 0 ? ((totalSelected / totalStudents) * 100).toFixed(1) : 0;

    // 5. Get the next 4 upcoming or active drives
    const upcomingDrives = await Drive.find({ status: { $in: ['Upcoming', 'Active'] } })
      .sort({ driveDate: 1 }) // Sort by the nearest date first
      .limit(4);

    // 6. Data for the Doughnut Chart
    // Note: This is a simplified aggregation. For complex scenarios, a more detailed query might be needed.
    const notSelectedCount = await Student.countDocuments({
        // This student is not selected in any drive
        'placementActivity.rounds.finalStatus': { $ne: 'Selected' },
        // And all their statuses are 'Not Selected' (meaning they are not in progress anywhere)
        'placementActivity.rounds.finalStatus': { $all: ['Not Selected'] }
    });

    const inProgressCount = totalStudents - totalSelected - notSelectedCount;

    // Consolidate all stats into one object
    const stats = {
      totalStudents,
      activeDrives,
      totalSelected,
      placementRate,
      upcomingDrives,
      placementStatusData: {
        labels: ["Selected", "Not Selected", "In Progress"],
        data: [totalSelected, notSelectedCount, inProgressCount],
      }
    };

    res.json(stats);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;