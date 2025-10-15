// LocalStorage service for task management
// Replaces Express.js backend with localStorage

class TaskAPI {
  constructor() {
    this.storageKey = 'taskManager_tasks';
    this.userStorageKey = 'taskManager_user';
    this.usersStorageKey = 'taskManager_users';
    this.initStorage();
  }

  // Initialize localStorage with default structure
  initStorage() {
    // Initialize tasks storage
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
    
    // Initialize users storage
    if (!localStorage.getItem(this.usersStorageKey)) {
      localStorage.setItem(this.usersStorageKey, JSON.stringify([]));
    }
  }

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem(this.userStorageKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get all tasks for current user
  getTasks(params = {}) {
    const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return Promise.resolve([]);
    }
    
    // Filter tasks by current user
    let userTasks = tasks.filter(task => task.user === currentUser.id);
    
    // Apply filters
    if (params.completed !== undefined) {
      userTasks = userTasks.filter(task => task.completed === (params.completed === 'true'));
    }
    
    if (params.priority) {
      userTasks = userTasks.filter(task => task.priority === params.priority);
    }
    
    if (params.category) {
      userTasks = userTasks.filter(task => task.category === params.category);
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      userTasks = userTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) || 
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by creation date (newest first)
    userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return Promise.resolve(userTasks);
  }

  // Create a new task
  createTask(taskData) {
    const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return Promise.reject(new Error('User not authenticated'));
    }
    
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      user: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    
    return Promise.resolve(newTask);
  }

  // Update a task
  updateTask(id, updates) {
    const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return Promise.reject(new Error('Task not found'));
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    
    return Promise.resolve(tasks[taskIndex]);
  }

  // Delete a task
  deleteTask(id) {
    const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredTasks));
    
    return Promise.resolve(true);
  }

  // Toggle task completion status
  toggleTask(id) {
    const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return Promise.reject(new Error('Task not found'));
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      completed: !tasks[taskIndex].completed,
      completedAt: tasks[taskIndex].completed ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    
    return Promise.resolve(tasks[taskIndex]);
  }

  // Get task statistics
  getTaskStats() {
    const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return Promise.resolve({ total: 0, completed: 0, active: 0, overdue: 0 });
    }
    
    const userTasks = tasks.filter(task => task.user === currentUser.id);
    
    const total = userTasks.length;
    const completed = userTasks.filter(task => task.completed).length;
    const active = total - completed;
    
    // Count overdue tasks (incomplete tasks with past due dates)
    const now = new Date();
    const overdue = userTasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < now
    ).length;
    
    // Category statistics
    const categoryStats = {};
    userTasks.forEach(task => {
      categoryStats[task.category] = (categoryStats[task.category] || 0) + 1;
    });
    
    // Priority statistics
    const priorityStats = {};
    userTasks.forEach(task => {
      priorityStats[task.priority] = (priorityStats[task.priority] || 0) + 1;
    });
    
    return Promise.resolve({
      overview: { total, completed, active, overdue },
      categories: Object.entries(categoryStats).map(([category, count]) => ({ _id: category, count })),
      priorities: Object.entries(priorityStats).map(([priority, count]) => ({ _id: priority, count }))
    });
  }

  // Bulk operations
  bulkOperation(action, taskIds) {
    const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    let affected = 0;
    
    switch (action) {
      case 'complete':
        taskIds.forEach(id => {
          const taskIndex = tasks.findIndex(task => task.id === id);
          if (taskIndex !== -1 && !tasks[taskIndex].completed) {
            tasks[taskIndex].completed = true;
            tasks[taskIndex].completedAt = new Date().toISOString();
            tasks[taskIndex].updatedAt = new Date().toISOString();
            affected++;
          }
        });
        break;
      case 'delete':
        const filteredTasks = tasks.filter(task => !taskIds.includes(task.id));
        affected = tasks.length - filteredTasks.length;
        localStorage.setItem(this.storageKey, JSON.stringify(filteredTasks));
        return Promise.resolve({ affected });
      default:
        return Promise.reject(new Error('Invalid bulk action'));
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    return Promise.resolve({ affected });
  }

  // Export tasks
  exportTasks(format = 'json') {
    const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return Promise.resolve([]);
    }
    
    const userTasks = tasks.filter(task => task.user === currentUser.id);
    
    if (format === 'csv') {
      // Convert to CSV format
      const headers = ['ID', 'Title', 'Description', 'Completed', 'Priority', 'Category', 'Due Date', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...userTasks.map(task => [
          task.id,
          `"${task.title.replace(/"/g, '""')}"`,
          task.description ? `"${task.description.replace(/"/g, '""')}"` : '',
          task.completed ? 'Yes' : 'No',
          task.priority,
          task.category,
          task.dueDate || '',
          task.createdAt
        ].join(','))
      ].join('\n');
      
      return Promise.resolve(csvContent);
    } else {
      return Promise.resolve(userTasks);
    }
  }

  // Import tasks
  importTasks(tasks, mergeStrategy = 'skip') {
    const existingTasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return Promise.reject(new Error('User not authenticated'));
    }
    
    let imported = 0;
    let skipped = 0;
    
    tasks.forEach(task => {
      const existingTaskIndex = existingTasks.findIndex(t => t.id === task.id && t.user === currentUser.id);
      
      if (existingTaskIndex !== -1) {
        // Task already exists
        if (mergeStrategy === 'overwrite') {
          existingTasks[existingTaskIndex] = { ...task, user: currentUser.id };
          imported++;
        } else {
          skipped++;
        }
      } else {
        // New task
        existingTasks.push({ ...task, user: currentUser.id, id: Date.now().toString() + Math.random() });
        imported++;
      }
    });
    
    localStorage.setItem(this.storageKey, JSON.stringify(existingTasks));
    
    return Promise.resolve({ imported, skipped });
  }

  // Subtask methods
  addSubtask(taskId, subtaskData) {
    return this.updateTask(taskId, {
      subtasks: [
        ...(this.getTaskById(taskId).subtasks || []),
        {
          id: Date.now().toString(),
          ...subtaskData,
          completed: false,
          createdAt: new Date().toISOString()
        }
      ]
    });
  }

  updateSubtask(taskId, subtaskId, updates) {
    const task = this.getTaskById(taskId);
    if (!task) {
      return Promise.reject(new Error('Task not found'));
    }
    
    const subtaskIndex = (task.subtasks || []).findIndex(sub => sub.id === subtaskId);
    if (subtaskIndex === -1) {
      return Promise.reject(new Error('Subtask not found'));
    }
    
    task.subtasks[subtaskIndex] = { ...task.subtasks[subtaskIndex], ...updates };
    
    return this.updateTask(taskId, { subtasks: task.subtasks });
  }

  deleteSubtask(taskId, subtaskId) {
    const task = this.getTaskById(taskId);
    if (!task) {
      return Promise.reject(new Error('Task not found'));
    }
    
    const updatedSubtasks = (task.subtasks || []).filter(sub => sub.id !== subtaskId);
    
    return this.updateTask(taskId, { subtasks: updatedSubtasks });
  }

  // Helper method to get a task by ID
  getTaskById(id) {
    const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return tasks.find(task => task.id === id);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getCurrentUser();
  }
}

export default new TaskAPI();