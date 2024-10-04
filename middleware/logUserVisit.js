const useragent = require('useragent');

// Create the middleware function
const logUserVisit = async (req, res, next) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Parse the user-agent string
  const userAgent = useragent.parse(req.headers['user-agent']);
  
  const browser = `${userAgent.family} ${userAgent.major}.${userAgent.minor}.${userAgent.patch}`;
  const os = `${userAgent.os.family} ${userAgent.os.major}.${userAgent.os.minor}.${userAgent.os.patch}`;
  const device = userAgent.device.family !== 'Other' ? userAgent.device.family : 'Unknown Device';
  
  // Format the important details with more clarity
  const importantDetails = `Browser: ${browser}, OS: ${os}, Device: ${device}`;

  const newUser = new User({
    ipAddress,
    userAgent: userAgent.toString(),
    deviceName: device,
    deviceAddress: ipAddress,
    additionalInfo: 'User visited the website',
    importantDetails: importantDetails,
  });

  try {
    await newUser.save();
    console.log('User information stored successfully.');
  } catch (error) {
    console.error('Error saving user info:', error);
  }

  next();
};

// Export the middleware function
module.exports = logUserVisit;
