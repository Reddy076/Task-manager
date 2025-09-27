const express = require('express');
const dbConnection = require('../utils/dbConnection');

const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint
// @access  Public
router.get('/', async (req, res) => {
  try {
    const health = dbConnection.getHealthStatus();
    const stats = await dbConnection.getStats();
    const testResult = await dbConnection.testConnection();

    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        ...health.database,
        test: testResult ? 'passed' : 'failed',
        stats
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      }
    };

    // Set status code based on database connection
    const statusCode = health.database.connected ? 200 : 503;
    
    res.status(statusCode).json(response);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// @route   GET /api/health/db
// @desc    Database-specific health check
// @access  Public
router.get('/db', async (req, res) => {
  try {
    const info = dbConnection.getConnectionInfo();
    const stats = await dbConnection.getStats();
    const testResult = await dbConnection.testConnection();

    res.json({
      success: true,
      database: {
        ...info,
        test: testResult ? 'passed' : 'failed',
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;