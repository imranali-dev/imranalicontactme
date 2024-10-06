// controllers/userController.js
const User = require('../models/User');

// Controller to fetch all users' details with optional filters
exports.getAllUsers = async (req, res) => {
  try {
    // Build the query object based on query parameters
    const query = {};

    // Add filters for specific fields if provided in the query params
    if (req.query.ipAddress) {
      query.ipAddress = req.query.ipAddress;
    }

    if (req.query.deviceName) {
      query.deviceName = req.query.deviceName;
    }

    if (req.query.os) {
      // Filter by OS family (case-insensitive)
      query.importantDetails = new RegExp(`OS: ${req.query.os}`, 'i');
    }

    if (req.query.deviceType) {
      query.importantDetails = new RegExp(`Device: .* \\(${req.query.deviceType}\\)`, 'i');
    }

    if (req.query.browser) {
      // Filter by browser name (case-insensitive)
      query.importantDetails = new RegExp(`Browser: ${req.query.browser}`, 'i');
    }

    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // Fetch users based on filters
    const users = await User.find(query);

    // If no users are found, respond with a 404
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found matching the criteria.' });
    }

    // Respond with filtered users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
