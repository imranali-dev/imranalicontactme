function errorHandler(err, req, res, next) {
    console.error('Error occurred:', err.message);
  
    if (err.message.includes('MongoDB')) {
      // Handle MongoDB-specific errors
      res.status(500).send({ message: 'Database error occurred', error: err.message });
    } else if (err.message.includes('required')) {
      // Handle validation errors
      res.status(400).send({ message: 'Invalid input', error: err.message });
    } else {
      // General server errors
      res.status(err.status || 500).send({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
      });
    }
  }
  
  module.exports = errorHandler;
  