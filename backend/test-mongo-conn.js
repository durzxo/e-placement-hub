const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/e-placement-hub';

console.log('Attempting to connect to:', uri);

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
})
  .then(() => {
    console.log('TEST: MongoDB connected successfully!');
    return mongoose.disconnect();
  })
  .then(() => process.exit(0))
  .catch(err => {
    console.error('TEST: MongoDB connection error:', err && err.message ? err.message : err);
    process.exit(1);
  });
