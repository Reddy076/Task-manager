# MongoDB Atlas Setup Guide

MongoDB Atlas is MongoDB's cloud database service. It's free for small projects and perfect for production.

## 🌐 Step-by-Step Atlas Setup

### Step 1: Create Account
1. Go to https://cloud.mongodb.com
2. Click "Try Free"
3. Create account with email or Google/GitHub

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "M0 Sandbox" (FREE tier)
3. Select cloud provider (AWS recommended)
4. Choose region closest to you
5. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `taskmanager`
5. Password: `SecurePassword123!` (use a strong password)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" (Clusters)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" driver
5. Copy the connection string

Example connection string:
```
mongodb+srv://taskmanager:<password>@cluster0.abcde.mongodb.net/taskmanager?retryWrites=true&w=majority
```

### Step 6: Update Environment
Replace `<password>` with your actual password and update `.env`:
```env
MONGODB_URI=mongodb+srv://taskmanager:SecurePassword123!@cluster0.abcde.mongodb.net/taskmanager?retryWrites=true&w=majority
```

## 🔒 Security Best Practices

### Production Security
- Use strong passwords
- Whitelist only necessary IP addresses
- Enable 2FA for your Atlas account
- Use separate databases for dev/staging/production

### Connection Security
- Always use SSL (included in Atlas)
- Rotate passwords regularly
- Monitor access logs

## 📊 Monitoring and Management

### Atlas Features
- **Monitoring**: Real-time performance metrics
- **Backup**: Automated backups
- **Alerts**: Custom alert rules
- **Scaling**: Easy cluster scaling

### Useful Atlas Tools
1. **Data Explorer**: Browse and edit data
2. **Performance Advisor**: Optimization suggestions
3. **Real-time Performance Panel**: Live metrics
4. **Charts**: Data visualization

## 💰 Pricing Tiers

### M0 Sandbox (FREE)
- 512 MB storage
- Shared RAM and vCPU
- No backup
- Perfect for development

### M2/M5 (Shared)
- Starting at $9/month
- Automated backups
- More storage and performance

### Dedicated Clusters
- Starting at $57/month
- Dedicated resources
- Advanced security features
- Production-ready

## 🧪 Testing Your Atlas Connection

Use our setup script:
```bash
npm run setup-db
```

Or test manually:
```javascript
const mongoose = require('mongoose');
mongoose.connect('your-atlas-connection-string')
  .then(() => console.log('✅ Atlas Connected!'))
  .catch(err => console.error('❌ Connection failed:', err));
```

## 🌍 Global Clusters

For global applications:
- Choose regions close to your users
- Consider multi-region clusters
- Use MongoDB Global Clusters for low latency

## 📈 Scaling Strategy

### Development → Production
1. Start with M0 (free)
2. Upgrade to M2/M5 for staging
3. Use dedicated clusters for production
4. Implement proper indexing
5. Monitor performance metrics

## 🛠️ Troubleshooting

### Common Issues
- **Authentication failed**: Check username/password
- **IP not whitelisted**: Add your IP to Network Access
- **Connection timeout**: Check firewall/VPN settings
- **Database not found**: Ensure database name in connection string

### Support Resources
- Atlas Documentation: https://docs.atlas.mongodb.com/
- Community Forums: https://community.mongodb.com/
- Support: Available with paid tiers