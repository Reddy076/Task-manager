const mongoose = require('mongoose');
const fileStorage = require('./fileStorage');

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connectionType = 'none';
    this.useFileStorage = false;
  }

  async connect() {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.log('⚠️  No MONGODB_URI found, using file storage');
      return this.enableFileStorage();
    }

    // Try MongoDB connection first
    try {
      console.log('🔗 Attempting MongoDB connection...');
      const options = {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 30000
      };

      const conn = await mongoose.connect(mongoUri, options);
      
      this.isConnected = true;
      this.useFileStorage = false;
      
      // Determine connection type
      if (mongoUri.includes('mongodb+srv://')) {
        this.connectionType = 'atlas';
        console.log('✅ MongoDB Atlas connected successfully!');
      } else if (mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
        this.connectionType = 'local';
        console.log('✅ Local MongoDB connected successfully!');
      } else {
        this.connectionType = 'remote';
        console.log('✅ Remote MongoDB connected successfully!');
      }
      
      console.log(`📍 Host: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      
      // Set up connection event handlers
      this.setupEventHandlers();
      
      return conn;
    } catch (error) {
      console.warn('⚠️  MongoDB connection failed:', error.message.split('.')[0]);
      return this.enableFileStorage();
    }
  }

  enableFileStorage() {
    console.log('📁 Switching to file-based storage...');
    this.useFileStorage = true;
    this.connectionType = 'file';
    this.isConnected = true;
    
    // Initialize file storage
    fileStorage.init();
    console.log('✅ File storage initialized successfully!');
    
    return { connection: { name: 'file-storage', host: 'local-files' } };
  }

  setupEventHandlers() {
    if (!this.useFileStorage) {
      mongoose.connection.on('connected', () => {
        console.log('🔗 MongoDB connection established');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('🔌 MongoDB disconnected');
        this.isConnected = false;
      });

      // Handle application termination
      process.on('SIGINT', async () => {
        if (this.isConnected && !this.useFileStorage) {
          await mongoose.connection.close();
          console.log('🔌 MongoDB connection closed through app termination');
        }
        process.exit(0);
      });
    }
  }

  getConnectionInfo() {
    return {
      isConnected: this.isConnected,
      type: this.connectionType,
      useFileStorage: this.useFileStorage,
      database: this.useFileStorage ? 'file-storage' : mongoose.connection?.name,
      host: this.useFileStorage ? 'local-files' : mongoose.connection?.host
    };
  }

  async testConnection() {
    try {
      if (this.useFileStorage) {
        // Test file storage
        const testData = { test: true, timestamp: new Date() };
        await fileStorage.createTask(testData);
        console.log('✅ File storage test successful');
        return true;
      } else {
        // Test MongoDB
        if (!this.isConnected) {
          throw new Error('Not connected to MongoDB');
        }
        
        await mongoose.connection.db.admin().ping();
        console.log('✅ MongoDB connection test successful');
        return true;
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }

  async getStats() {
    try {
      if (this.useFileStorage) {
        const users = await fileStorage.readUsers();
        const tasks = await fileStorage.readTasks();
        return {
          storage: 'file',
          users: users.length,
          tasks: tasks.length,
          status: 'connected'
        };
      } else {
        const stats = await mongoose.connection.db.stats();
        return {
          storage: 'mongodb',
          database: mongoose.connection.name,
          collections: stats.collections,
          dataSize: stats.dataSize,
          status: 'connected'
        };
      }
    } catch (error) {
      return {
        storage: this.useFileStorage ? 'file' : 'mongodb',
        status: 'error',
        error: error.message
      };
    }
  }

  // Health check endpoint data
  getHealthStatus() {
    return {
      database: {
        connected: this.isConnected,
        type: this.connectionType,
        storage: this.useFileStorage ? 'file' : 'mongodb',
        host: this.useFileStorage ? 'local-files' : mongoose.connection?.host,
        readyState: this.useFileStorage ? 1 : mongoose.connection?.readyState
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new DatabaseConnection();