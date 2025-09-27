const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['personal', 'work', 'shopping', 'health', 'other'],
    default: 'personal'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // Due date should be in the future when creating new tasks
        return !value || value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Due date cannot be in the past'
    }
  },
  reminder: {
    enabled: { type: Boolean, default: false },
    date: Date,
    notified: { type: Boolean, default: false }
  },
  subtasks: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Subtask title cannot exceed 200 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Note cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  completedAt: Date,
  archivedAt: Date,
  position: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ user: 1, completed: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, tags: 1 });
taskSchema.index({ createdAt: -1 });

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && !this.completed;
});

// Virtual for progress (based on subtasks)
taskSchema.virtual('progress').get(function() {
  if (this.subtasks.length === 0) {
    return this.completed ? 100 : 0;
  }
  
  const completedSubtasks = this.subtasks.filter(subtask => subtask.completed).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Pre-save middleware to update completedAt
taskSchema.pre('save', function(next) {
  if (this.isModified('completed')) {
    if (this.completed && !this.completedAt) {
      this.completedAt = new Date();
    } else if (!this.completed) {
      this.completedAt = undefined;
    }
  }
  next();
});

// Pre-save middleware to update position for new tasks
taskSchema.pre('save', async function(next) {
  if (this.isNew && this.position === 0) {
    try {
      const lastTask = await this.constructor
        .findOne({ user: this.user })
        .sort({ position: -1 });
      
      this.position = lastTask ? lastTask.position + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to move task to position
taskSchema.methods.moveToPosition = async function(newPosition) {
  const Task = this.constructor;
  const oldPosition = this.position;
  
  if (newPosition === oldPosition) return this;
  
  try {
    if (newPosition > oldPosition) {
      // Moving down: shift tasks up
      await Task.updateMany(
        {
          user: this.user,
          position: { $gt: oldPosition, $lte: newPosition }
        },
        { $inc: { position: -1 } }
      );
    } else {
      // Moving up: shift tasks down
      await Task.updateMany(
        {
          user: this.user,
          position: { $gte: newPosition, $lt: oldPosition }
        },
        { $inc: { position: 1 } }
      );
    }
    
    this.position = newPosition;
    return await this.save();
  } catch (error) {
    throw new Error('Failed to reorder task');
  }
};

// Static method to get user statistics
taskSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } },
        active: { $sum: { $cond: ['$completed', 0, 1] } },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lt: ['$dueDate', new Date()] },
                  { $eq: ['$completed', false] },
                  { $ne: ['$dueDate', null] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
  
  return stats[0] || { total: 0, completed: 0, active: 0, overdue: 0 };
};

// Static method for bulk operations
taskSchema.statics.bulkComplete = async function(taskIds, userId) {
  return await this.updateMany(
    { _id: { $in: taskIds }, user: userId },
    { 
      completed: true, 
      completedAt: new Date() 
    }
  );
};

taskSchema.statics.bulkDelete = async function(taskIds, userId) {
  return await this.deleteMany(
    { _id: { $in: taskIds }, user: userId }
  );
};

// Ensure virtual fields are included in JSON
taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);