require('dotenv').config();
const mongoose = require('mongoose');
let _connected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('YOUR_USERNAME')) {
    console.log('WARNING: No MongoDB URI - using built-in mock data');
    console.log('   Set MONGODB_URI in .env to use MongoDB Atlas free tier');
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    _connected = true;
    console.log('MongoDB Atlas connected:', mongoose.connection.host);
    return true;
  } catch (e) {
    console.error('MongoDB failed:', e.message);
    console.log('Falling back to mock data');
    return false;
  }
}

function isConnected() { return _connected && mongoose.connection.readyState === 1; }
module.exports = { connectDB, isConnected };
