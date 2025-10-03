#!/usr/bin/env node

// Simple startup script for Render deployment
// This script ensures the server starts correctly

const { spawn } = require('child_process');
const path = require('path');

// Set the port from environment variable or default to 8080
const port = process.env.PORT || 8080;
process.env.PORT = port;

console.log(`Starting server on port ${port}...`);

// Spawn the node process to run server.js
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: process.env
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});