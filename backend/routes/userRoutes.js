const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs'); // For password hashing

// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with that email already exists' });
    }

    // 2. Create a new user instance
    user = new User({
      name,
      email,
      password,
      role
    });

    // 3. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save the user to the database
    await user.save();

    // 5. Send a success response (don't send the password back)
    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;  