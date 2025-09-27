const fs = require('fs').promises;
const path = require('path');

class FileStorage {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.usersFile = path.join(this.dataDir, 'users.json');
    this.tasksFile = path.join(this.dataDir, 'tasks.json');
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Initialize files if they don't exist
      try {
        await fs.access(this.usersFile);
      } catch {
        await fs.writeFile(this.usersFile, JSON.stringify([]));
      }
      
      try {
        await fs.access(this.tasksFile);
      } catch {
        await fs.writeFile(this.tasksFile, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Failed to initialize file storage:', error);
    }
  }

  async readUsers() {
    try {
      const data = await fs.readFile(this.usersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async writeUsers(users) {
    await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
  }

  async readTasks() {
    try {
      const data = await fs.readFile(this.tasksFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async writeTasks(tasks) {
    await fs.writeFile(this.tasksFile, JSON.stringify(tasks, null, 2));
  }

  // User operations
  async createUser(userData) {
    const users = await this.readUsers();
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(newUser);
    await this.writeUsers(users);
    return newUser;
  }

  async findUserByEmail(email) {
    const users = await this.readUsers();
    return users.find(user => user.email === email);
  }

  async findUserById(id) {
    const users = await this.readUsers();
    return users.find(user => user._id === id);
  }

  async updateUser(id, updates) {
    const users = await this.readUsers();
    const index = users.findIndex(user => user._id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date() };
      await this.writeUsers(users);
      return users[index];
    }
    return null;
  }

  // Task operations
  async createTask(taskData) {
    const tasks = await this.readTasks();
    const newTask = {
      _id: Date.now().toString(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks.push(newTask);
    await this.writeTasks(tasks);
    return newTask;
  }

  async findTasksByUser(userId) {
    const tasks = await this.readTasks();
    return tasks.filter(task => task.user === userId);
  }

  async findTaskById(id) {
    const tasks = await this.readTasks();
    return tasks.find(task => task._id === id);
  }

  async updateTask(id, updates) {
    const tasks = await this.readTasks();
    const index = tasks.findIndex(task => task._id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
      await this.writeTasks(tasks);
      return tasks[index];
    }
    return null;
  }

  async deleteTask(id) {
    const tasks = await this.readTasks();
    const filteredTasks = tasks.filter(task => task._id !== id);
    await this.writeTasks(filteredTasks);
    return filteredTasks.length < tasks.length;
  }

  async deleteManyTasks(userIdOrQuery) {
    const tasks = await this.readTasks();
    let filteredTasks;
    
    if (typeof userIdOrQuery === 'string') {
      // Delete by user ID
      filteredTasks = tasks.filter(task => task.user !== userIdOrQuery);
    } else {
      // Delete by query object
      filteredTasks = tasks.filter(task => {
        // Simple query matching
        for (const [key, value] of Object.entries(userIdOrQuery)) {
          if (task[key] !== value) return true;
        }
        return false;
      });
    }
    
    await this.writeTasks(filteredTasks);
    return { deletedCount: tasks.length - filteredTasks.length };
  }
}

module.exports = new FileStorage();