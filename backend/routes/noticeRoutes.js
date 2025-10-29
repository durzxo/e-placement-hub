const express = require('express');
const router = express.Router();
const Notice = require('../models/noticeModel');
const Student = require('../models/studentModel');
const nodemailer = require('nodemailer');

// Email transporter setup (reusing from userRoutes)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send notice notification emails to all students
const sendNoticeNotification = async (notice) => {
  try {
    // Get all student emails
    const students = await Student.find({}, 'email name');
    
    if (students.length === 0) {
      console.log('No students found to notify');
      return;
    }

    // Create email content
    const subject = `🔔 New Notice: ${notice.title}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0d9488; margin: 0; font-size: 28px;">📢 New Notice Posted</h1>
          </div>
          
          <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; border-left: 4px solid #0d9488; margin-bottom: 20px;">
            <h2 style="color: #0d9488; margin: 0 0 10px 0; font-size: 22px;">${notice.title}</h2>
            <p style="color: #065f46; margin: 0; font-size: 14px;">Priority: <strong style="text-transform: uppercase;">${notice.priority}</strong> | Category: <strong>${notice.category}</strong></p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Notice Details:</h3>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
              <p style="color: #4b5563; line-height: 1.6; margin: 0; white-space: pre-wrap;">${notice.content}</p>
            </div>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; border: 1px solid #f59e0b; margin-bottom: 25px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">📅 <strong>Date:</strong> ${notice.date} | ⏰ <strong>Time:</strong> ${notice.time}</p>
            <p style="color: #92400e; margin: 5px 0 0 0; font-size: 14px;">👤 <strong>Posted by:</strong> ${notice.author}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">Visit the placement portal to view all notices and updates</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/notices" 
               style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">View Notice Portal</a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">This is an automated notification from the E-Placement Hub</p>
          </div>
        </div>
      </div>
    `;

    // Send emails to all students
    const emailPromises = students.map(student => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: subject,
        html: htmlContent,
      };
      
      return transporter.sendMail(mailOptions)
        .then(() => {
          console.log(`Notice notification sent to ${student.name} (${student.email})`);
        })
        .catch(error => {
          console.error(`Failed to send notice notification to ${student.email}:`, error.message);
        });
    });

    await Promise.allSettled(emailPromises);
    console.log(`Notice notification process completed for ${students.length} students`);
    
  } catch (error) {
    console.error('Error sending notice notifications:', error);
  }
};

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
// @desc    Create a new notice and send email notifications to students
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
        
        // Send email notifications to all students (async, don't wait)
        sendNoticeNotification(notice).catch(error => {
            console.error('Failed to send notice notifications:', error);
        });
        
        console.log(`New notice created: "${notice.title}" - Email notifications initiated`);
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
        const notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        res.json({ message: 'Notice removed successfully' });
    } catch (error) {
        console.error('Error deleting notice:', error);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/notices/test-email
// @desc    Test email notification system
router.post('/test-email', async (req, res) => {
    try {
        // Check if email configuration is set
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).json({ 
                message: 'Email configuration missing. Please set EMAIL_USER and EMAIL_PASS in .env file' 
            });
        }

        // Create a test notice
        const testNotice = {
            _id: 'test-id',
            title: 'Test Email Notification',
            content: 'This is a test notice to verify email notifications are working correctly.',
            priority: 'high',
            category: 'general',
            author: 'System Test',
            createdAt: new Date(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0]
        };

        // Get student count for feedback
        const studentCount = await Student.countDocuments();
        
        // Send test email notification
        await sendNoticeNotification(testNotice);
        
        res.json({ 
            message: `Test email notifications sent successfully to ${studentCount} students!`,
            notice: testNotice,
            emailConfig: {
                user: process.env.EMAIL_USER,
                configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
            }
        });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ 
            message: 'Failed to send test email notifications',
            error: error.message 
        });
    }
});

module.exports = router;