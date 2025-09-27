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
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use(morgan('combined'));

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

// Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));
app.use('/api/export', require('./routes/export'));

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
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();