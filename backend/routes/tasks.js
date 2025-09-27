const express = require('express');
const Task = require('../models/Task');
const { authenticate, checkResourceOwnership } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/tasks
// @desc    Get all tasks for authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      sort = '-createdAt',
      completed,
      priority,
      category,
      search,
      dueDate,
      tags
    } = req.query;

    // Build filter object
    const filter = { user: req.user._id };

    // Add filters
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    if (priority) {
      filter.priority = priority;
    }

    if (category) {
      filter.category = category;
    }

    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    // Date filters
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      switch (dueDate) {
        case 'today':
          filter.dueDate = {
            $gte: today,
            $lt: tomorrow
          };
          break;
        case 'tomorrow':
          filter.dueDate = {
            $gte: tomorrow,
            $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
          };
          break;
        case 'week':
          filter.dueDate = {
            $gte: today,
            $lte: nextWeek
          };
          break;
        case 'overdue':
          filter.dueDate = { $lt: today };
          filter.completed = false;
          break;
      }
    }

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username email firstName lastName');

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
});

// @route   GET /api/tasks/stats
// @desc    Get task statistics for authenticated user
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Task.getUserStats(req.user._id);
    
    // Get additional analytics
    const categoryStats = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats,
        categories: categoryStats,
        priorities: priorityStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', checkResourceOwnership(Task), (req, res) => {
  res.json({
    success: true,
    data: { task: req.resource }
  });
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      user: req.user._id
    };

    // Process tags if they're a string
    if (typeof taskData.tags === 'string') {
      taskData.tags = taskData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    const task = new Task(taskData);
    await task.save();

    // Populate user info
    await task.populate('user', 'username email firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create task error:', error.message);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create task'
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', checkResourceOwnership(Task), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Process tags if they're a string
    if (typeof updates.tags === 'string') {
      updates.tags = updates.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    // Don't allow user field to be updated
    delete updates.user;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'username email firstName lastName');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Update task error:', error.message);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task completion status
// @access  Private
router.patch('/:id/toggle', checkResourceOwnership(Task), async (req, res) => {
  try {
    const task = req.resource;
    task.completed = !task.completed;
    await task.save();

    res.json({
      success: true,
      message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`,
      data: { task }
    });
  } catch (error) {
    console.error('Toggle task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle task status'
    });
  }
});

// @route   PATCH /api/tasks/:id/move
// @desc    Move task to new position
// @access  Private
router.patch('/:id/move', checkResourceOwnership(Task), async (req, res) => {
  try {
    const { position } = req.body;
    
    if (typeof position !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Position must be a number'
      });
    }

    const task = await req.resource.moveToPosition(position);

    res.json({
      success: true,
      message: 'Task position updated',
      data: { task }
    });
  } catch (error) {
    console.error('Move task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to move task'
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', checkResourceOwnership(Task), async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
});

// @route   POST /api/tasks/bulk
// @desc    Bulk operations on tasks
// @access  Private
router.post('/bulk', async (req, res) => {
  try {
    const { action, taskIds } = req.body;

    if (!action || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid action and task IDs'
      });
    }

    let result;
    
    switch (action) {
      case 'complete':
        result = await Task.bulkComplete(taskIds, req.user._id);
        break;
      case 'delete':
        result = await Task.bulkDelete(taskIds, req.user._id);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid bulk action'
        });
    }

    res.json({
      success: true,
      message: `Bulk ${action} completed`,
      data: { affected: result.modifiedCount || result.deletedCount }
    });
  } catch (error) {
    console.error('Bulk operation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Bulk operation failed'
    });
  }
});

// @route   POST /api/tasks/:id/subtasks
// @desc    Add subtask
// @access  Private
router.post('/:id/subtasks', checkResourceOwnership(Task), async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Subtask title is required'
      });
    }

    const task = req.resource;
    task.subtasks.push({ title: title.trim() });
    await task.save();

    res.status(201).json({
      success: true,
      message: 'Subtask added successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Add subtask error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add subtask'
    });
  }
});

// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
// @desc    Update subtask
// @access  Private
router.patch('/:id/subtasks/:subtaskId', checkResourceOwnership(Task), async (req, res) => {
  try {
    const { title, completed } = req.body;
    const task = req.resource;
    const subtask = task.subtasks.id(req.params.subtaskId);

    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }

    if (title !== undefined) subtask.title = title;
    if (completed !== undefined) subtask.completed = completed;

    await task.save();

    res.json({
      success: true,
      message: 'Subtask updated successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Update subtask error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update subtask'
    });
  }
});

// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
// @desc    Delete subtask
// @access  Private
router.delete('/:id/subtasks/:subtaskId', checkResourceOwnership(Task), async (req, res) => {
  try {
    const task = req.resource;
    task.subtasks.pull(req.params.subtaskId);
    await task.save();

    res.json({
      success: true,
      message: 'Subtask deleted successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Delete subtask error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subtask'
    });
  }
});

module.exports = router;