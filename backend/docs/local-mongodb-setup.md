# Local MongoDB Installation Guide

## Windows Installation

### Step 1: Download MongoDB
1. Go to https://www.mongodb.com/try/download/community
2. Select "Windows" as your platform
3. Download the .msi installer

### Step 2: Install MongoDB
1. Run the downloaded .msi file
2. Choose "Complete" installation
3. Install as a Windows Service (recommended)
4. Install MongoDB Compass (GUI tool)

### Step 3: Start MongoDB Service
Open Command Prompt as Administrator and run:
```cmd
net start MongoDB
```

### Step 4: Verify Installation
```cmd
mongo --version
```

### Step 5: Test Connection
```cmd
mongo
```
You should see the MongoDB shell prompt.

## Alternative: Using MongoDB with Docker

If you prefer Docker, you can run MongoDB in a container:

```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest

# Connect to MongoDB
docker exec -it mongodb mongo admin
```

## Configuration for Local MongoDB

Update your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

## Troubleshooting

### MongoDB Service Not Starting
- Check if port 27017 is available
- Run as Administrator
- Check Windows Services for MongoDB

### Connection Issues
- Verify MongoDB is running: `tasklist | findstr mongod`
- Check firewall settings
- Ensure correct port (27017)

### Performance Optimization
- Consider setting up replica sets for production
- Configure appropriate indexes
- Monitor with MongoDB Compass