const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Otp = require('../models/otpModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// --- Nodemailer Email Transporter Setup ---
// You must configure this with your own email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', 'yahoo', or use SMTP
  auth: {
    user: process.env.EMAIL_USER, // Your email address from .env
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password from .env
  },
});

// @route   POST /api/users/register
// @desc    Register a new user (students only with APSIT email)
router.post('/register', async (req, res) => {
  const { name, email, password, role, moodleId } = req.body;
  
  try {
    // Validate APSIT email format for students
    if (role === 'student' || !role) {
      const apsitEmailRegex = /^\d{8}@apsit\.edu\.in$/;
      if (!apsitEmailRegex.test(email)) {
        return res.status(400).json({ 
          message: 'Only APSIT students can register. Please use your college email in format: moodleid@apsit.edu.in' 
        });
      }
      
      // Extract and validate Moodle ID
      const extractedMoodleId = email.match(/^(\d{8})@apsit\.edu\.in$/)[1];
      if (!moodleId || moodleId !== extractedMoodleId) {
        return res.status(400).json({ 
          message: 'Invalid Moodle ID. Please ensure your email matches your 8-digit student ID.' 
        });
      }
    }
    
    // Prevent admin registration through this endpoint
    if (role === 'admin') {
      return res.status(403).json({ 
        message: 'Admin accounts cannot be created through registration. Please contact system administrator.' 
      });
    }
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }
    
    // Check if moodleId already exists for students
    if (moodleId) {
      const existingMoodleUser = await User.findOne({ moodleId });
      if (existingMoodleUser) {
        return res.status(400).json({ message: 'A student account already exists with this Moodle ID' });
      }
    }
    
    // Create new user
    user = new User({ 
      name, 
      email, 
      password, 
      role: 'student', // Force role to student
      moodleId: moodleId || null
    });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Student account registered successfully! You can now login.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        moodleId: user.moodleId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { user: { id: user.id, name: user.name, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
    res.json({ token });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// --- FORGOT PASSWORD FLOW ---

// @route   POST /api/users/forgot-password
// @desc    Step 1: User submits email, we generate and email an OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if a user exists or not for security
      return res.status(200).json({ message: 'If an account with this email exists, an OTP has been sent.' });
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpCode, salt);

    // Save OTP to database
    await Otp.create({ email, otp: hashedOtp });

    // Send email with the OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP for password reset is: ${otpCode}. It is valid for 5 minutes.`,
      html: `<p>Your OTP for password reset is: <strong>${otpCode}</strong>. It is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent to your email address.' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while sending email.');
  }
});

// @route   POST /api/users/verify-otp
// @desc    Step 2: User submits OTP, we verify it
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired.' });
        }
        const isMatch = await bcrypt.compare(otp, otpRecord.otp);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // OTP is correct. Generate a temporary token for password reset.
        const payload = { user: { email: otpRecord.email } };
        const resetToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });

        // Delete the used OTP
        await Otp.deleteOne({ _id: otpRecord._id });

        res.json({ message: 'OTP verified successfully.', resetToken });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


// @route   POST /api/users/reset-password
// @desc    Step 3: User submits new password with the temporary token
router.post('/reset-password', async (req, res) => {
    const { newPassword, token } = req.body;
    try {
        // Verify the temporary reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded.user;
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update user's password in the database
        await User.updateOne({ email }, { $set: { password: hashedPassword } });
        
        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid or expired token. Please start over.' });
        }
        res.status(500).send('Server error.');
    }
});


module.exports = router;