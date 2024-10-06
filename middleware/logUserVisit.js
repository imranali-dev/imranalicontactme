const DeviceDetector = require('device-detector-js');  // Import device-detector-js
const User = require('../models/User');

// Create the middleware function
const logUserVisit = async (req, res, next) => {
  try {
    // Get user's IP address from headers or connection
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;

    // Extract the user-agent string from the request
    const userAgentString = req.headers['user-agent'] || null;

    // Use device-detector-js to parse the user-agent and extract detailed device info
    const deviceDetector = new DeviceDetector();
    const deviceInfo = userAgentString ? deviceDetector.parse(userAgentString) : {};

    // Extract relevant information from the parsed device info
    const browser = `${deviceInfo.client?.name || 'Unknown Browser'} ${deviceInfo.client?.version || ''}`.trim();
    const os = `${deviceInfo.os?.name || 'Unknown OS'} ${deviceInfo.os?.version || ''}`.trim();

    // Use the model and brand name if available, or default to null
    const deviceName = deviceInfo.device?.model 
      ? `${deviceInfo.device.brand || 'Unknown Brand'} ${deviceInfo.device.model}` 
      : null;
    
    const deviceType = deviceInfo.device?.type || null;  // E.g., 'smartphone', 'tablet', 'desktop', etc.

    // Format the important details more clearly
    const importantDetails = `Browser: ${browser}, OS: ${os}, Device: ${deviceName || 'Unknown Device'} (${deviceType || 'Unknown Type'})`;

    // Check if the user already exists based on their IP address and user agent
    let user = await User.findOne({ ipAddress, userAgent: userAgentString });

    if (user) {
      // If the user exists, update the visit count and last visit time
      user.visitCount += 1;
      user.lastVisit = Date.now();
      await user.save();
      console.log(`User visit updated. Visit count: ${user.visitCount}`);
    } else {
      // If the user does not exist, create a new entry
      const newUser = new User({
        ipAddress,
        userAgent: userAgentString,    // Save raw user-agent string
        deviceName,                     // Save the exact device model or null
        deviceAddress: ipAddress,       // Store the IP address
        additionalInfo: 'User visited the website',  // Log some additional info
        importantDetails,               // Save formatted details
      });

      await newUser.save();
      console.log('New user information stored successfully.');
    }
  } catch (error) {
    // Log the error and respond with a 500 status if necessary
    console.error('Error saving or updating user info:', error);
    // Optionally, you can send an error response:
    // return res.status(500).json({ error: 'Internal server error' });
  }

  // Call the next middleware in the stack
  next();
};

// Export the middleware function
module.exports = logUserVisit;
