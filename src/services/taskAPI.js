// Mock API service for task management
// In a real application, these would be actual HTTP requests to a backend API

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // Mock API endpoint
const STORAGE_KEY = 'task-manager-tasks';

class TaskAPI {
  // Simulate network delay
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all tasks
  async getTasks() {
    await this.delay();
    
    try {
      // In a real app, this would be: fetch(`${API_BASE_URL}/tasks`)
      const tasks = localStorage.getItem(STORAGE_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      throw new Error('Failed to fetch tasks');
    }
  }

  // Create a new task
  async createTask(taskData) {
    await this.delay();
    
    try {
      const tasks = await this.getTasks();
      const newTask = {
        id: Date.now(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedTasks = [...tasks, newTask];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      
      return newTask;
    } catch (error) {
      throw new Error('Failed to create task');
    }
  }

  // Update an existing task
  async updateTask(id, updates) {
    await this.delay();
    
    try {
      const tasks = await this.getTasks();
      const taskIndex = tasks.findIndex(task => task.id === id);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      tasks[taskIndex] = updatedTask;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      
      return updatedTask;
    } catch (error) {
      throw new Error('Failed to update task');
    }
  }

  // Delete a task
  async deleteTask(id) {
    await this.delay();
    
    try {
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(task => task.id !== id);
      
      if (filteredTasks.length === tasks.length) {
        throw new Error('Task not found');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
      return true;
    } catch (error) {
      throw new Error('Failed to delete task');
    }
  }

  // Toggle task completion status
  async toggleTask(id) {
    await this.delay();
    
    try {
      const tasks = await this.getTasks();
      const task = tasks.find(t => t.id === id);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      return await this.updateTask(id, { completed: !task.completed });
    } catch (error) {
      throw new Error('Failed to toggle task');
    }
  }

  // Get task statistics
  async getTaskStats() {
    await this.delay();
    
    try {
      const tasks = await this.getTasks();
      
      return {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        active: tasks.filter(t => !t.completed).length,
        overdue: tasks.filter(t => 
          t.dueDate && 
          new Date(t.dueDate) < new Date() && 
          !t.completed
        ).length
      };
    } catch (error) {
      throw new Error('Failed to get task statistics');
    }
  }
}

export default new TaskAPI();