# 🚀 Complete MongoDB Setup Guide

This guide covers both **Local MongoDB** and **MongoDB Atlas** setup for your Task Manager backend.

## 🎯 Quick Decision Guide

| Feature | Local MongoDB | MongoDB Atlas | File Storage |
|---------|---------------|---------------|--------------|
| **Setup Time** | 10-15 minutes | 5-10 minutes | 0 minutes |
| **Cost** | Free | Free tier available | Free |
| **Best for** | Development | Production | Development/Testing |
| **Reliability** | Local dependency | Cloud reliability | Basic |
| **Scalability** | Manual | Automatic | Limited |

---

## 🌐 Option 1: MongoDB Atlas (Cloud) - Recommended

### ✅ Advantages
- No local installation required
- Automatic backups and scaling
- Global availability
- Built-in monitoring and security
- Free tier available (512MB)

### 📋 Step-by-Step Setup

#### 1. Create Atlas Account
```
1. Go to https://cloud.mongodb.com
2. Click "Try Free"
3. Sign up with email/Google/GitHub
```

#### 2. Create Cluster
```
1. Click "Build a Database"
2. Choose "M0 Sandbox" (FREE)
3. Select Cloud Provider: AWS (recommended)
4. Region: Choose closest to your location
5. Cluster Name: Keep default or rename
6. Click "Create Cluster" (takes 3-5 minutes)
```

#### 3. Create Database User
```
1. Go to "Database Access" → "Add New Database User"
2. Authentication Method: Password
3. Username: taskmanager
4. Password: Create strong password (save it!)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"
```

#### 4. Network Access
```
1. Go to "Network Access" → "Add IP Address"
2. For Development: "Allow Access from Anywhere" (0.0.0.0/0)
3. For Production: Add specific IP addresses
4. Click "Confirm"
```

#### 5. Get Connection String
```
1. Go to "Database" (your cluster)
2. Click "Connect" → "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy connection string
```

#### 6. Update Configuration
```bash
# Edit your .env file
MONGODB_URI=mongodb+srv://taskmanager:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_PASSWORD` with your actual password
- `cluster0.xxxxx` with your actual cluster URL

---

## 💻 Option 2: Local MongoDB Installation

### ✅ Advantages
- Complete control over database
- No internet dependency
- Fast local connections
- Great for development

### 📋 Windows Installation

#### 1. Download MongoDB
```
1. Go to https://www.mongodb.com/try/download/community
2. Platform: Windows
3. Package: msi
4. Download the installer
```

#### 2. Install MongoDB
```
1. Run the .msi installer
2. Choose "Complete" installation
3. ✅ Install MongoDB as a Service
4. ✅ Install MongoDB Compass (GUI tool)
5. Complete installation
```

#### 3. Start MongoDB Service
```cmd
# Option A: Command Line (as Administrator)
net start MongoDB

# Option B: Windows Services
1. Press Win + R, type "services.msc"
2. Find "MongoDB" service
3. Right-click → Start
```

#### 4. Verify Installation
```cmd
# Check MongoDB version
mongod --version

# Connect to MongoDB shell
mongosh
# or for older versions:
mongo
```

#### 5. Update Configuration
```bash
# Edit your .env file
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

### 🐳 Alternative: Docker Setup
```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongodb_data:/data/db \
  mongo:latest

# Connection string for Docker
MONGODB_URI=mongodb://admin:password@localhost:27017/taskmanager?authSource=admin
```

---

## 🛠️ Testing Your Setup

### Using Our Setup Scripts
```bash
# Interactive setup wizard
npm run setup-mongodb

# Quick connection test
npm run setup-db
```

### Manual Testing
```javascript
const mongoose = require('mongoose');

// Test connection
mongoose.connect('your-connection-string')
  .then(() => console.log('✅ Connected!'))
  .catch(err => console.error('❌ Failed:', err.message));
```

### Using MongoDB Compass (GUI)
```
1. Open MongoDB Compass
2. Enter your connection string
3. Click "Connect"
4. Browse databases and collections
```

---

## 🔧 Troubleshooting

### Atlas Issues
| Problem | Solution |
|---------|----------|
| Authentication failed | Check username/password in connection string |
| IP not whitelisted | Add your IP in Network Access |
| Connection timeout | Check firewall/VPN settings |
| Invalid URL | Verify cluster URL and database name |

### Local MongoDB Issues
| Problem | Solution |
|---------|----------|
| Service won't start | Run `net start MongoDB` as Administrator |
| Port 27017 in use | Check for other MongoDB instances |
| Permission denied | Ensure proper file permissions in data directory |
| Can't connect | Verify MongoDB is running: `tasklist \| findstr mongod` |

### General Issues
```bash
# Check if MongoDB process is running
tasklist | findstr mongod

# Check port availability
netstat -an | findstr :27017

# View MongoDB logs
# Atlas: Check Atlas monitoring
# Local: Check Windows Event Viewer or MongoDB log files
```

---

## 🎯 Which Option Should You Choose?

### Choose **MongoDB Atlas** if:
- ✅ You want hassle-free setup
- ✅ Planning to deploy to production
- ✅ Need automatic backups
- ✅ Want built-in monitoring
- ✅ Prefer cloud solutions

### Choose **Local MongoDB** if:
- ✅ Working offline frequently
- ✅ Want complete control
- ✅ Need custom configurations
- ✅ Handling sensitive data locally
- ✅ Want fastest possible connections

### Choose **File Storage** if:
- ✅ Just getting started
- ✅ Prototyping quickly
- ✅ Don't want to set up databases yet
- ✅ Need immediate development environment

---

## 🚀 Next Steps

1. **Complete setup** using this guide
2. **Test connection** with our scripts
3. **Start backend** with `npm run dev`
4. **Connect frontend** to backend API
5. **Deploy to production** when ready

---

## 📞 Need Help?

- **Atlas Documentation**: https://docs.atlas.mongodb.com/
- **MongoDB Community**: https://community.mongodb.com/
- **Local Installation Guide**: https://docs.mongodb.com/manual/installation/
- **Our Setup Scripts**: `npm run setup-mongodb`

---

**Status: ✅ Both options available and ready to use!**