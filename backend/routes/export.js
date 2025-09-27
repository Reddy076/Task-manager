const express = require('express');
const Task = require('../models/Task');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/export/json
// @desc    Export user's tasks as JSON
// @access  Private
router.get('/json', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username email firstName lastName');

    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.fullName
      },
      tasks: tasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        category: task.category,
        tags: task.tags,
        dueDate: task.dueDate,
        reminder: task.reminder,
        subtasks: task.subtasks,
        notes: task.notes,
        progress: task.progress,
        isOverdue: task.isOverdue,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        completedAt: task.completedAt
      })),
      summary: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        activeTasks: tasks.filter(t => !t.completed).length,
        overdueTasks: tasks.filter(t => t.isOverdue).length
      }
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="tasks-export-${new Date().toISOString().split('T')[0]}.json"`);

    res.json(exportData);
  } catch (error) {
    console.error('JSON export error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to export tasks as JSON'
    });
  }
});

// @route   GET /api/export/csv
// @desc    Export user's tasks as CSV
// @access  Private
router.get('/csv', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    // Define CSV headers
    const headers = [
      'ID',
      'Title',
      'Description',
      'Completed',
      'Priority',
      'Category',
      'Tags',
      'Due Date',
      'Progress (%)',
      'Is Overdue',
      'Created Date',
      'Updated Date',
      'Completed Date'
    ];

    // Convert tasks to CSV rows
    const csvRows = tasks.map(task => [
      task._id.toString(),
      `"${task.title.replace(/"/g, '""')}"`, // Escape quotes in title
      `"${(task.description || '').replace(/"/g, '""')}"`, // Escape quotes in description
      task.completed ? 'Yes' : 'No',
      task.priority,
      task.category,
      `"${task.tags.join(', ')}"`,
      task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      task.progress,
      task.isOverdue ? 'Yes' : 'No',
      task.createdAt.toISOString().split('T')[0],
      task.updatedAt.toISOString().split('T')[0],
      task.completedAt ? task.completedAt.toISOString().split('T')[0] : ''
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="tasks-export-${new Date().toISOString().split('T')[0]}.csv"`);

    res.send(csvContent);
  } catch (error) {
    console.error('CSV export error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to export tasks as CSV'
    });
  }
});

// @route   POST /api/export/import
// @desc    Import tasks from JSON data
// @access  Private
router.post('/import', async (req, res) => {
  try {
    const { tasks, mergeStrategy = 'skip' } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: 'Tasks must be an array'
      });
    }

    let imported = 0;
    let skipped = 0;
    let errors = [];

    for (const taskData of tasks) {
      try {
        // Check if task already exists (by title and created date if available)
        const existingTask = await Task.findOne({
          user: req.user._id,
          title: taskData.title,
          ...(taskData.createdAt && { createdAt: new Date(taskData.createdAt) })
        });

        if (existingTask) {
          if (mergeStrategy === 'skip') {
            skipped++;
            continue;
          } else if (mergeStrategy === 'update') {
            // Update existing task
            await Task.findByIdAndUpdate(existingTask._id, {
              ...taskData,
              user: req.user._id,
              updatedAt: new Date()
            });
            imported++;
            continue;
          }
        }

        // Create new task
        const newTask = new Task({
          ...taskData,
          user: req.user._id,
          _id: undefined, // Remove original ID
          createdAt: taskData.createdAt ? new Date(taskData.createdAt) : new Date(),
          updatedAt: new Date()
        });

        await newTask.save();
        imported++;
      } catch (taskError) {
        errors.push({
          task: taskData.title || 'Unknown',
          error: taskError.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Import completed',
      data: {
        imported,
        skipped,
        errors: errors.length,
        errorDetails: errors
      }
    });
  } catch (error) {
    console.error('Import error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to import tasks'
    });
  }
});

// @route   GET /api/export/backup
// @desc    Create complete backup of user data
// @access  Private
router.get('/backup', async (req, res) => {
  try {
    // Get all user data
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    const user = req.user.toJSON();

    const backupData = {
      backupDate: new Date().toISOString(),
      version: '1.0',
      user: {
        ...user,
        // Remove sensitive data from backup
        password: undefined,
        emailVerificationToken: undefined,
        passwordResetToken: undefined,
        passwordResetExpires: undefined
      },
      tasks: tasks.map(task => task.toJSON()),
      statistics: await Task.getUserStats(req.user._id)
    };

    // Set headers for backup download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="taskmanager-backup-${new Date().toISOString().split('T')[0]}.json"`);

    res.json(backupData);
  } catch (error) {
    console.error('Backup error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create backup'
    });
  }
});

// @route   POST /api/export/restore
// @desc    Restore user data from backup
// @access  Private
router.post('/restore', async (req, res) => {
  try {
    const { backupData, clearExisting = false } = req.body;

    if (!backupData || !backupData.tasks) {
      return res.status(400).json({
        success: false,
        message: 'Invalid backup data'
      });
    }

    // Optionally clear existing data
    if (clearExisting) {
      await Task.deleteMany({ user: req.user._id });
    }

    // Restore tasks
    let restored = 0;
    let errors = [];

    for (const taskData of backupData.tasks) {
      try {
        const newTask = new Task({
          ...taskData,
          user: req.user._id,
          _id: undefined, // Generate new ID
          createdAt: taskData.createdAt ? new Date(taskData.createdAt) : new Date(),
          updatedAt: new Date()
        });

        await newTask.save();
        restored++;
      } catch (taskError) {
        errors.push({
          task: taskData.title || 'Unknown',
          error: taskError.message
        });
      }
    }

    // Update user preferences if they exist in backup
    if (backupData.user && backupData.user.preferences) {
      await User.findByIdAndUpdate(req.user._id, {
        preferences: backupData.user.preferences
      });
    }

    res.json({
      success: true,
      message: 'Restore completed',
      data: {
        restored,
        errors: errors.length,
        errorDetails: errors
      }
    });
  } catch (error) {
    console.error('Restore error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to restore backup'
    });
  }
});

module.exports = router;