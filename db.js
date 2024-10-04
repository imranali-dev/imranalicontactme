const mongoose = require('mongoose');

const uri = 'mongodb+srv://codewithcodesandbox11:Imranali13@cluster0.ma4owvq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function connectToMongoDB() {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    console.error('Stack trace:', err.stack);
    throw new Error('Failed to connect to MongoDB');
  }
}

module.exports = { connectToMongoDB };
