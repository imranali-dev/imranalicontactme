// Import Mongoose for MongoDB interactions
const mongoose = require('mongoose');

// Define the schema for storing user information
const userSchema = new mongoose.Schema({
    
  // Store the IP address of the user
  ipAddress: {
    type: String,
    required: true,
    default: 'Unknown IP', // Fallback in case the IP address is not available
  },
  // Store the user agent string (browser and device details)
  userAgent: {
    type: String,
    required: true,
    default: 'Unknown User Agent', // Fallback in case the user agent is not available
  },
  // Optionally store the device name (like "iPhone", "Windows PC", etc.)
  deviceName: {
    type: String,
    default: 'Unknown Device', // Fallback value
  },
  // Optionally store the device address (for potential geolocation use)
  deviceAddress: {
    type: String,
    default: 'Unknown Device Address', // Fallback value
  },
  // Store the date the user visited (default: current date)
  date: {
    type: Date,
    default: Date.now, // Automatically use the current date
  },
  // Additional info field for any extra data you might want to save
  additionalInfo: {
    type: String,
    default: 'No additional info', // Default message
  },
  // Store important details that could be useful for future analysis
  importantDetails: {
    type: String,
    default: 'No important details', // Fallback message
  },
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true,
});

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema);
module.exports = User;
