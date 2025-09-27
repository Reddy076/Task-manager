const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const jwtUtil = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');
const fileStorage = require('../utils/fileStorage');

const router = express.Router();

// Rate limiting for auth endpoints
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 requests per windowMs for auth
//   message: {
//     success: false,
//     message: 'Too many authentication attempts, please try again later.'
//   }
// });

// const registerLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 100, // Increase limit for testing
//   message: {
//     success: false,
//     message: 'Too many registration attempts, please try again later.'
//   }
// });

// Helper function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Helper function to compare password
const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

// Helper function to get dbConnection from app locals
const getDbConnection = (req) => {
  // Add debugging
  if (!req || !req.app) {
    console.error('Request or app object is undefined');
    return null;
  }
  
  if (!req.app.locals) {
    console.error('App locals is undefined');
    return null;
  }
  
  if (!req.app.locals.dbConnection) {
    console.error('dbConnection not found in app locals');
    return null;
  }
  
  return req.app.locals.dbConnection;
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log('=== REGISTRATION DEBUG INFO ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request app locals:', req.app ? 'exists' : 'undefined');
    console.log('Request app locals keys:', req.app && req.app.locals ? Object.keys(req.app.locals) : 'N/A');
    
    if (!req.body) {
      console.error('Request body is undefined or null');
      return res.status(400).json({
        success: false,
        message: 'Request body is missing'
      });
    }

    const { username, email, password, firstName, lastName } = req.body;
    console.log('Extracted fields:', { username, email, password: password ? '[PROVIDED]' : '[MISSING]', firstName, lastName });

    // Validation
    if (!username || !email || !password || !firstName || !lastName) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (password.length < 6) {
      console.log('Validation failed - password too short');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const dbConnection = getDbConnection(req);
    console.log('dbConnection status:', dbConnection ? 'found' : 'not found');
    if (dbConnection) {
      console.log('useFileStorage:', dbConnection.useFileStorage);
    }

    // Check if user already exists
    let existingUser;
    if (dbConnection && dbConnection.useFileStorage) {
      console.log('Using file storage to check existing user');
      // Use file storage
      existingUser = await fileStorage.findUserByEmail(email);
      if (!existingUser) {
        const users = await fileStorage.readUsers();
        existingUser = users.find(user => user.username === username);
      }
    } else {
      console.log('Using MongoDB to check existing user');
      // Use MongoDB
      existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });
    }
    
    console.log('Existing user check result:', existingUser ? 'user exists' : 'no existing user');

    if (existingUser) {
      console.log('User already exists, returning error');
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'User with this email already exists'
          : 'Username is already taken'
      });
    }

    // Create new user
    let user;
    if (dbConnection && dbConnection.useFileStorage) {
      console.log('Creating user with file storage');
      // Hash password for file storage
      const hashedPassword = await hashPassword(password);
      
      // Use file storage
      user = await fileStorage.createUser({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName
      });
    } else {
      console.log('Creating user with MongoDB');
      // Use MongoDB (password will be hashed by the pre-save hook)
      user = new User({
        username,
        email,
        password, // Mongoose will hash this automatically
        firstName,
        lastName
      });
      
      console.log('Saving user to MongoDB...');
      await user.save();
      console.log('User saved successfully');
    }

    // Generate tokens
    console.log('Generating tokens...');
    const accessToken = jwtUtil.generateAccessToken(user);
    const refreshToken = jwtUtil.generateRefreshToken(user);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('Registration successful, sending response');
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: dbConnection && dbConnection.useFileStorage ? user : user.toJSON(),
        accessToken
      }
    });
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Registration error:', error.message);
    console.error('Registration error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      console.log('Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// Add logging at the top of the file
console.log('Auth routes file loaded');

// Add a simple test route
router.get('/test', (req, res) => {
  console.log('Auth test route hit');
  res.json({ message: 'Auth routes are working' });
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  console.log('Login route hit');
  try {
    console.log('=== LOGIN DEBUG INFO ===');
    console.log('Request body:', req.body);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    console.log('Finding user by email:', email);
    const dbConnection = getDbConnection(req);
    console.log('dbConnection status:', dbConnection ? 'found' : 'not found');
    if (dbConnection) {
      console.log('useFileStorage:', dbConnection.useFileStorage);
    }

    // Find user by email
    let user;
    if (dbConnection && dbConnection.useFileStorage) {
      console.log('Using file storage to find user');
      // Use file storage
      user = await fileStorage.findUserByEmail(email);
    } else {
      console.log('Using MongoDB to find user');
      // Use MongoDB
      user = await User.findOne({ email }).select('+password');
    }
    
    console.log('User lookup result:', user ? 'user found' : 'user not found');

    if (!user) {
      console.log('User not found, returning 401');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked (for file storage, we'll implement a simple check)
    if (dbConnection && dbConnection.useFileStorage) {
      // Simple lock check for file storage
      if (user.lockUntil && user.lockUntil > Date.now()) {
        console.log('Account locked (file storage)');
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts'
        });
      }
    } else {
      // MongoDB lock check
      if (user.isLocked) {
        console.log('Account locked (MongoDB)');
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts'
        });
      }
    }

    console.log('Comparing passwords...');
    // Verify password
    const isPasswordValid = dbConnection && dbConnection.useFileStorage 
      ? await comparePassword(password, user.password)
      : await user.comparePassword(password);
    
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      // Increment login attempts (simplified for file storage)
      if (dbConnection && dbConnection.useFileStorage) {
        // For file storage, we'll implement a simple login attempt counter
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        if (user.loginAttempts >= 5) {
          user.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
        }
        await fileStorage.updateUser(user._id, {
          loginAttempts: user.loginAttempts,
          lockUntil: user.lockUntil
        });
      } else {
        // For MongoDB
        await user.incLoginAttempts();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('Password is valid, resetting login attempts');
    // Reset login attempts on successful login
    if (dbConnection && dbConnection.useFileStorage) {
      if (user.loginAttempts > 0) {
        await fileStorage.updateUser(user._id, {
          loginAttempts: 0,
          lockUntil: null
        });
      }
    } else {
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }
    }

    console.log('Updating last login');
    // Update last login
    if (dbConnection && dbConnection.useFileStorage) {
      await fileStorage.updateUser(user._id, {
        lastLogin: new Date()
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    console.log('Generating tokens...');
    // Generate tokens
    const accessToken = jwtUtil.generateAccessToken(user);
    const refreshToken = jwtUtil.generateRefreshToken(user);
    console.log('Tokens generated successfully');

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('Login successful, sending response');
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: dbConnection && dbConnection.useFileStorage ? user : user.toJSON(),
        accessToken
      }
    });
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Login error:', error.message);
    console.error('Login error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided'
      });
    }

    // Verify refresh token
    const decoded = jwtUtil.verifyToken(refreshToken);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    const dbConnection = getDbConnection(req);

    // Find user
    let user;
    if (dbConnection.useFileStorage) {
      // Use file storage
      user = await fileStorage.findUserById(decoded.userId);
    } else {
      // Use MongoDB
      user = await User.findById(decoded.userId);
    }
    
    if (!user || (dbConnection.useFileStorage ? (user.lockUntil && user.lockUntil > Date.now()) : user.isLocked)) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account locked'
      });
    }

    // Generate new access token
    const accessToken = jwtUtil.generateAccessToken(user);

    res.json({
      success: true,
      data: { accessToken }
    });
  } catch (error) {
    console.error('Token refresh error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, preferences } = req.body;
    let updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (preferences) updates.preferences = { ...req.user.preferences, ...preferences };

    const dbConnection = getDbConnection(req);

    let user;
    if (dbConnection.useFileStorage) {
      // Use file storage
      user = await fileStorage.updateUser(req.user._id, updates);
    } else {
      // Use MongoDB
      user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: dbConnection.useFileStorage ? user : user }
    });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new passwords'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const dbConnection = getDbConnection(req);

    // Get user with password
    let user;
    if (dbConnection.useFileStorage) {
      // Use file storage
      user = await fileStorage.findUserById(req.user._id);
    } else {
      // Use MongoDB
      user = await User.findById(req.user._id).select('+password');
    }
    
    // Verify current password
    const isCurrentPasswordValid = dbConnection.useFileStorage
      ? await comparePassword(currentPassword, user.password)
      : await user.comparePassword(currentPassword);
      
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    if (dbConnection.useFileStorage) {
      const hashedPassword = await hashPassword(newPassword);
      user = await fileStorage.updateUser(req.user._id, {
        password: hashedPassword
      });
    } else {
      user.password = newPassword;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

module.exports = router;