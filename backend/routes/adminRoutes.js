const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Predefined admin credentials - In production, these should be environment variables
const ADMIN_CREDENTIALS = [
  {
    email: 'admin@apsit.edu.in',
    password: 'admin123', // This will be hashed
    name: 'System Administrator',
    department: 'Computer Department'
  },
  {
    email: 'placement.admin@apsit.edu.in', 
    password: 'placement2024',
    name: 'Placement Officer',
    department: 'Placement Cell'
  },
  {
    email: 'hod.computer@apsit.edu.in',
    password: 'hod2024',
    name: 'HOD Computer',
    department: 'Computer Department'
  }
];

// @route   POST /api/admin/login
// @desc    Admin login with predefined credentials
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if credentials match predefined admin accounts
    const adminCredential = ADMIN_CREDENTIALS.find(admin => admin.email === email);
    
    if (!adminCredential) {
      return res.status(401).json({ 
        message: 'Access denied. This email is not authorized for admin access.' 
      });
    }
    
    // Verify password
    if (password !== adminCredential.password) {
      return res.status(401).json({ 
        message: 'Invalid admin credentials.' 
      });
    }
    
    // Check if admin user exists in database, if not create one
    let adminUser = await User.findOne({ email });
    
    if (!adminUser) {
      // Create admin user in database
      const hashedPassword = await bcrypt.hash(adminCredential.password, 10);
      adminUser = new User({
        name: adminCredential.name,
        email: adminCredential.email,
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
    }
    
    // Generate JWT token
    const payload = { 
      user: { 
        id: adminUser.id, 
        name: adminUser.name, 
        role: adminUser.role,
        email: adminUser.email,
        department: adminCredential.department
      } 
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    res.json({
      success: true,
      token,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        department: adminCredential.department
      },
      message: 'Admin login successful'
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin authentication' });
  }
});

// @route   POST /api/admin/change-password
// @desc    Change admin password (requires current admin authentication)
router.post('/change-password', async (req, res) => {
  // This would require authentication middleware
  const { currentPassword, newPassword } = req.body;
  
  try {
    // Implementation for changing admin password
    res.json({ message: 'Password change functionality - to be implemented with proper auth middleware' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/credentials
// @desc    Get list of authorized admin emails (for setup/reference)
router.get('/credentials', (req, res) => {
  const adminEmails = ADMIN_CREDENTIALS.map(admin => ({
    email: admin.email,
    name: admin.name,
    department: admin.department
  }));
  
  res.json({
    message: 'Authorized admin accounts',
    admins: adminEmails,
    note: 'Contact system administrator to add new admin accounts'
  });
});

module.exports = router;