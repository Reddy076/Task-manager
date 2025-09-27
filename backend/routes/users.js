const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/users/profile
// @desc    Get user profile (alternative to /auth/me)
// @access  Private
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', async (req, res) => {
  try {
    const { theme, notifications, timeZone } = req.body;
    
    const updates = {
      'preferences.theme': theme,
      'preferences.notifications': notifications,
      'preferences.timeZone': timeZone
    };

    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update preferences error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account and all associated data
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Get user with password to verify
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Delete all user's tasks
    const Task = require('../models/Task');
    await Task.deleteMany({ user: req.user._id });

    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    // Clear cookies
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});

module.exports = router;