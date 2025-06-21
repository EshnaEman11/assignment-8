import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📋 Connection details:');
    console.log('   - URI provided:', process.env.MONGODB_URI ? '✅ Yes' : '❌ No');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in .env file');
      process.exit(1);
    }

    // Hide sensitive parts of URI for logging
    const safeUri = process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    console.log('   - URI format:', safeUri);

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Connection successful!');
    console.log('📊 Connection info:');
    console.log('   - Host:', conn.connection.host);
    console.log('   - Database:', conn.connection.name);
    console.log('   - Ready State:', conn.connection.readyState);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.length);
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('   - Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('💡 Troubleshooting tips:');
      console.error('   1. Check your username and password in .env file');
      console.error('   2. Make sure your MongoDB user has proper permissions');
      console.error('   3. Verify your cluster is active');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Troubleshooting tips:');
      console.error('   1. Check your cluster URL in .env file');
      console.error('   2. Verify your internet connection');
      console.error('   3. Make sure your cluster is running');
    }
    
    process.exit(1);
  }
};

testConnection();