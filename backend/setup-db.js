const mongoose = require('mongoose');
require('dotenv').config();

async function setupMongoDB() {
  console.log('🚀 Task Manager - Database Setup Guide\n');
  
  console.log('🌐 Option 1: MongoDB Atlas (Cloud) - Recommended for production');
  console.log('1. Go to https://cloud.mongodb.com');
  console.log('2. Create a free account');
  console.log('3. Create a new cluster (free tier available)');
  console.log('4. Create a database user with password');
  console.log('5. Whitelist your IP address (0.0.0.0/0 for development)');
  console.log('6. Get the connection string and update MONGODB_URI in .env');
  console.log('   Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskmanager\n');
  
  console.log('💻 Option 2: Local MongoDB Installation');
  console.log('1. Download MongoDB Community Server from:');
  console.log('   https://www.mongodb.com/try/download/community');
  console.log('2. Install MongoDB');
  console.log('3. Start MongoDB service:');
  console.log('   - Windows: net start MongoDB');
  console.log('   - macOS/Linux: sudo systemctl start mongod');
  console.log('4. Update .env: MONGODB_URI=mongodb://localhost:27017/taskmanager\n');
  
  console.log('📁 Option 3: File Storage (Development Only)');
  console.log('The backend will automatically use file-based storage if MongoDB is unavailable.');
  console.log('This is perfect for development and testing.\n');
  
  // Test current configuration
  console.log('🔧 Testing current configuration...');
  const mongoUri = process.env.MONGODB_URI;
  console.log('Current URI:', mongoUri.replace(/\/\/.*:.*@/, '//***:***@'));
  
  try {
    console.log('⏳ Attempting MongoDB connection...');
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📍 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    
    // Test database operations
    const testCollection = conn.connection.db.collection('connection_test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    await testCollection.deleteOne({ test: true });
    console.log('✅ Database operations test passed!');
    
    console.log('\n🎉 Your MongoDB setup is working perfectly!');
    console.log('🚀 You can now start your backend with: npm run dev');
    
  } catch (error) {
    console.log('⚠️  MongoDB connection failed:', error.message.split('.')[0]);
    console.log('\n📁 Don\'t worry! The backend will use file storage automatically.');
    console.log('🚀 You can start development with: npm run dev');
    console.log('\n💡 For production, please set up MongoDB Atlas (Option 1).');
  } finally {
    await mongoose.disconnect();
  }
  
  console.log('\n✨ Setup complete! Choose your preferred option above.');
  process.exit(0);
}

setupMongoDB();