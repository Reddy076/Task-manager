// Real API service for task management
// Connects to Express.js backend with authentication

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://task-manager-backend.vercel.app/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

class TaskAPI {
  constructor() {
    this.token = localStorage.getItem('accessToken');
  }

  // Get authorization headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, clear it
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.reload();
        throw new Error('Authentication required');
      }
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  // Task methods
  async getTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/tasks${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    });
    
    const data = await this.handleResponse(response);
    return data.data.tasks;
  }

  async createTask(taskData) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(taskData)
    });
    
    const data = await this.handleResponse(response);
    return data.data.task;
  }

  async updateTask(id, updates) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(updates)
    });
    
    const data = await this.handleResponse(response);
    return data.data.task;
  }

  async deleteTask(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include'
    });
    
    await this.handleResponse(response);
    return true;
  }

  async toggleTask(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      credentials: 'include'
    });
    
    const data = await this.handleResponse(response);
    return data.data.task;
  }

  async getTaskStats() {
    const response = await fetch(`${API_BASE_URL}/tasks/stats`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    });
    
    const data = await this.handleResponse(response);
    return data.data.overview;
  }

  // Bulk operations
  async bulkOperation(action, taskIds) {
    const response = await fetch(`${API_BASE_URL}/tasks/bulk`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ action, taskIds })
    });
    
    return await this.handleResponse(response);
  }

  // Export/Import methods
  async exportTasks(format = 'json') {
    const response = await fetch(`${API_BASE_URL}/export/${format}`, {
      headers: this.getAuthHeaders(),
      credentials: 'include'
    });
    
    if (format === 'csv') {
      return await response.text();
    } else {
      return await response.json();
    }
  }

  async importTasks(tasks, mergeStrategy = 'skip') {
    const response = await fetch(`${API_BASE_URL}/export/import`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ tasks, mergeStrategy })
    });
    
    return await this.handleResponse(response);
  }

  // Subtask methods
  async addSubtask(taskId, subtaskData) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(subtaskData)
    });
    
    const data = await this.handleResponse(response);
    return data.data.task;
  }

  async updateSubtask(taskId, subtaskId, updates) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(updates)
    });
    
    const data = await this.handleResponse(response);
    return data.data.task;
  }

  async deleteSubtask(taskId, subtaskId) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include'
    });
    
    const data = await this.handleResponse(response);
    return data.data.task;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }
}

export default new TaskAPI();