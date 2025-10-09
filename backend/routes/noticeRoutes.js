const express = require('express');
const router = express.Router();
const Notice = require('../models/noticeModel');

// @route   GET /api/notices
// @desc    Get all notices
router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        console.error('Error fetching notices:', error);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/notices
// @desc    Create a new notice
router.post('/', async (req, res) => {
    try {
        const { title, content, date, time, author, priority, category } = req.body;

        const newNotice = new Notice({
            title,
            content,
            date,
            time,
            author,
            priority,
            category
        });

        const notice = await newNotice.save();
        res.status(201).json(notice);
    } catch (error) {
        console.error('Error creating notice:', error);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/notices/:id
// @desc    Delete a notice
router.delete('/:id', async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        await notice.remove();
        res.json({ message: 'Notice removed' });
    } catch (error) {
        console.error('Error deleting notice:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;