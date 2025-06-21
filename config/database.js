import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is missing');
    
    // Check if password placeholder is still there
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('<db_password>')) {
      console.error('❌ Password placeholder detected in MONGODB_URI');
      console.error('💡 Please replace <db_password> with your actual MongoDB password in .env file');
      process.exit(1);
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error('Error Message:', error.message);
    
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('🔐 Authentication failed - Please check your username and password');
      console.error('💡 Common fixes:');
      console.error('   1. Replace <db_password> with your actual password in .env file');
      console.error('   2. Make sure your password doesn\'t contain special characters');
      console.error('   3. If password has special chars, URL encode them');
      console.error('   4. Verify your database user exists and has proper permissions');
    } else if (error.message.includes('network')) {
      console.error('🌐 Network error - Please check your internet connection');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 DNS resolution failed - Please check your cluster URL');
      console.error('💡 Your cluster URL should look like: cluster0.xxxxx.mongodb.net');
      console.error('💡 Make sure to get the complete URL from MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed through app termination');
  process.exit(0);
});

export default connectDB;