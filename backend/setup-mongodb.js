const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupMongoDB() {
  console.log('🚀 MongoDB Setup Wizard for Task Manager\n');
  
  console.log('Choose your MongoDB setup option:');
  console.log('1. 🌐 MongoDB Atlas (Cloud) - Recommended for production');
  console.log('2. 💻 Local MongoDB - Good for development');
  console.log('3. 📁 File Storage - No setup required');
  console.log('4. 🧪 Test existing configuration\n');
  
  const choice = await question('Enter your choice (1-4): ');
  
  switch(choice) {
    case '1':
      await setupAtlas();
      break;
    case '2':
      await setupLocal();
      break;
    case '3':
      await setupFileStorage();
      break;
    case '4':
      await testExistingConnection();
      break;
    default:
      console.log('❌ Invalid choice. Please run the script again.');
  }
  
  rl.close();
}

async function setupAtlas() {
  console.log('\n🌐 MongoDB Atlas Setup\n');
  
  console.log('📋 Prerequisites:');
  console.log('1. MongoDB Atlas account (https://cloud.mongodb.com)');
  console.log('2. Created cluster (M0 free tier available)');
  console.log('3. Database user created');
  console.log('4. IP address whitelisted\n');
  
  const hasAccount = await question('Do you have an Atlas account and cluster? (y/n): ');
  
  if (hasAccount.toLowerCase() !== 'y') {
    console.log('\n📖 Please follow these steps:');
    console.log('1. Go to https://cloud.mongodb.com');
    console.log('2. Create a free account');
    console.log('3. Create a new cluster (choose M0 free tier)');
    console.log('4. Create a database user in "Database Access"');
    console.log('5. Whitelist your IP in "Network Access"');
    console.log('6. Get connection string from "Connect" button\n');
    console.log('📄 Detailed guide: docs/mongodb-atlas-setup.md\n');
  }
  
  const connectionString = await question('Enter your Atlas connection string: ');
  
  if (connectionString) {
    await testConnection(connectionString, 'Atlas');
    await updateEnvFile(connectionString);
  }
}

async function setupLocal() {
  console.log('\n💻 Local MongoDB Setup\n');
  
  console.log('📋 Prerequisites for Windows:');
  console.log('1. Download MongoDB Community Server');
  console.log('2. Install as Windows Service');
  console.log('3. Start MongoDB service\n');
  
  const isInstalled = await question('Is MongoDB already installed? (y/n): ');
  
  if (isInstalled.toLowerCase() !== 'y') {
    console.log('\n📥 Installation Steps:');
    console.log('1. Go to https://www.mongodb.com/try/download/community');
    console.log('2. Download Windows .msi installer');
    console.log('3. Run installer and choose "Complete" setup');
    console.log('4. Install as Windows Service');
    console.log('5. Open Command Prompt as Administrator');
    console.log('6. Run: net start MongoDB\n');
    console.log('📄 Detailed guide: docs/local-mongodb-setup.md\n');
    
    const continueSetup = await question('Continue with testing connection? (y/n): ');
    if (continueSetup.toLowerCase() !== 'y') {
      return;
    }
  }
  
  const localUri = 'mongodb://localhost:27017/taskmanager';
  await testConnection(localUri, 'Local MongoDB');
  await updateEnvFile(localUri);
}

async function setupFileStorage() {
  console.log('\n📁 File Storage Setup\n');
  console.log('✅ File storage requires no additional setup!');
  console.log('📂 Data will be stored in: ./data/');
  console.log('🔄 Automatically switches when MongoDB is unavailable');
  console.log('🚀 Perfect for development and testing\n');
  
  console.log('💡 To use file storage:');
  console.log('1. Keep current .env file as is');
  console.log('2. Start server with: npm run dev');
  console.log('3. Backend will auto-detect and use file storage\n');
  
  console.log('🎉 File storage is ready to use!');
}

async function testExistingConnection() {
  console.log('\n🧪 Testing Current Configuration\n');
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('❌ No MONGODB_URI found in .env file');
    return;
  }
  
  console.log('📍 Current URI:', mongoUri.replace(/\/\/.*:.*@/, '//***:***@'));
  await testConnection(mongoUri, 'Current Configuration');
}

async function testConnection(uri, name) {
  console.log(`\n⏳ Testing ${name} connection...`);
  
  try {
    const conn = await mongoose.connect(uri, { 
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connection successful!');
    console.log('📍 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    
    // Test database operations
    const testCollection = conn.connection.db.collection('connection_test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    await testCollection.deleteOne({ test: true });
    console.log('✅ Database operations test passed!');
    
    console.log(`\n🎉 ${name} setup successful!`);
    console.log('🚀 You can now start your backend with: npm run dev\n');
    
  } catch (error) {
    console.log(`❌ ${name} connection failed:`);
    console.log('Error:', error.message.split('.')[0]);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solutions for Local MongoDB:');
      console.log('- Ensure MongoDB service is running: net start MongoDB');
      console.log('- Check if port 27017 is available');
      console.log('- Verify MongoDB is installed correctly');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Solutions for Atlas:');
      console.log('- Check username and password in connection string');
      console.log('- Ensure user has correct permissions');
      console.log('- Verify database name is correct');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Solutions for Atlas:');
      console.log('- Check internet connection');
      console.log('- Verify cluster URL is correct');
      console.log('- Check if VPN/firewall is blocking connection');
    }
    
    console.log('\n📁 Fallback: The backend will use file storage automatically');
  } finally {
    await mongoose.disconnect();
  }
}

async function updateEnvFile(uri) {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update MONGODB_URI
    if (envContent.includes('MONGODB_URI=')) {
      envContent = envContent.replace(/MONGODB_URI=.*/, `MONGODB_URI=${uri}`);
    } else {
      envContent += `\nMONGODB_URI=${uri}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with new connection string');
  } catch (error) {
    console.log('⚠️  Could not update .env file automatically');
    console.log('📝 Please manually update MONGODB_URI in .env file:');
    console.log(`MONGODB_URI=${uri}`);
  }
}

// Start the wizard
setupMongoDB().catch(console.error);