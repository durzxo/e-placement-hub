const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'company'],
    default: 'student'
  },
  moodleId: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    unique: true,
    sparse: true, // Allows null values to not conflict with uniqueness
    validate: {
      validator: function(v) {
        // Only validate for students, and only if moodleId is provided
        if (this.role === 'student' && v) {
          return /^\d{8}$/.test(v);
        }
        return true;
      },
      message: 'Moodle ID must be exactly 8 digits'
    }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;