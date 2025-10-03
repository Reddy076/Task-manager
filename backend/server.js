const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dbConnection = require('./utils/dbConnection');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'https://task-manager-frontend.vercel.app',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    'https://*.vercel.app',
    'https://*.onrender.com'
  ].filter(Boolean),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // Increase limit for testing
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use(morgan('combined'));

// Add middleware to log all requests at the very beginning
app.use((req, res, next) => {
  console.log(`=== SERVER REQUEST DEBUG ===`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, req.headers);
  next();
});

// Add another middleware to log request body after parsing
app.use((req, res, next) => {
  console.log(`=== REQUEST BODY DEBUG ===`);
  console.log(`Body:`, req.body);
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await dbConnection.connect();
    const info = dbConnection.getConnectionInfo();
    
    console.log(`📊 Database: ${info.database}`);
    console.log(`🔗 Connection: ${info.type}`);
    console.log(`💾 Storage: ${info.useFileStorage ? 'File-based' : 'MongoDB'}`);
  } catch (error) {
    console.error('⚠️  Database initialization failed:', error.message);
    console.log('📁 Falling back to file storage...');
  }
};

// Make connection info available globally
app.locals.dbConnection = dbConnection;

// Add a simple test route to see if the server is responding
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server is working', timestamp: new Date() });
});

// Routes
console.log('Loading routes...');
app.use('/api/health', require('./routes/health'));
console.log('Health routes loaded');
app.use('/api/auth', require('./routes/auth'));
console.log('Auth routes loaded');
app.use('/api/tasks', require('./routes/tasks'));
console.log('Tasks routes loaded');
app.use('/api/users', require('./routes/users'));
console.log('Users routes loaded');
app.use('/api/export', require('./routes/export'));
console.log('Export routes loaded');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
  
  // Handle unhandled errors
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => {
      process.exit(1);
    });
  });
  
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
  
  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
};

startServer();