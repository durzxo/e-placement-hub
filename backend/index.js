// index.js (CLEANED)

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes');
const driveRoutes = require('./routes/driveRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const offerLetterRoutes = require('./routes/offerLetterRoutes');
const authRoutes = require('./routes/authRoutes');
const noticeRoutes = require('./routes/noticeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// NOTE: I removed the duplicate 'app.use('/api/drives', driveRoutes);' from here.

const PORT = process.env.PORT || 5000; // Uses port 5000 from .env

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes

app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/drives', driveRoutes); // This is the correct and necessary call
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/offer-letter', offerLetterRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/auth', authRoutes);
// Serve uploads from the project-level uploads folder so files saved to
// ../../uploads (from route's multer destination) are accessible.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});