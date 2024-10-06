const DeviceDetector = require('device-detector-js');  // Import device-detector-js
const User = require('../models/User');

// Create the middleware function
const logUserVisit = async (req, res, next) => {
  // Get user's IP address from headers or connection
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Extract the user-agent string from the request
  const userAgentString = req.headers['user-agent'];

  // Use device-detector-js to parse the user-agent and extract detailed device info
  const deviceDetector = new DeviceDetector();
  const deviceInfo = deviceDetector.parse(userAgentString);

  // Extract relevant information from the parsed device info
  const browser = `${deviceInfo.client.name || 'Unknown Browser'} ${deviceInfo.client.version || ''}`.trim();
  const os = `${deviceInfo.os.name || 'Unknown OS'} ${deviceInfo.os.version || ''}`.trim();
  
  // Use the model and brand name if available, or default to a more descriptive output
  const deviceName = deviceInfo.device.model 
    ? `${deviceInfo.device.brand || 'Unknown Brand'} ${deviceInfo.device.model}` 
    : 'Unknown Device';
  
  const deviceType = deviceInfo.device.type || 'Unknown Type';  // E.g., 'smartphone', 'tablet', 'desktop', etc.

  // Format the important details more clearly
  const importantDetails = `Browser: ${browser}, OS: ${os}, Device: ${deviceName} (${deviceType})`;

  try {
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
        deviceName: deviceName,        // Save the exact device model
        deviceAddress: ipAddress,      // Store the IP address
        additionalInfo: 'User visited the website',  // Log some additional info
        importantDetails: importantDetails,          // Save formatted details
      });

      await newUser.save();
      console.log('New user information stored successfully.');
    }
  } catch (error) {
    console.error('Error saving or updating user info:', error);
  }

  // Call the next middleware in the stack
  next();
};

// Export the middleware function
module.exports = logUserVisit;
