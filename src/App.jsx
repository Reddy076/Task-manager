import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import TaskSearch from './components/TaskSearch';
import TaskStats from './components/TaskStats';
import ThemeToggle from './components/ThemeToggle';
import NotificationSystem from './components/NotificationSystem';
import TaskAPI from './services/taskAPI';
import './App.css';

const TaskManager = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    category: 'all',
    priority: 'all',
    dueDate: 'all',
    tag: 'all'
  });

  // Load tasks when user is authenticated
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  // Load tasks from backend API
  const loadTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await TaskAPI.getTasks();
      setTasks(tasksData);
    } catch (err) {
      console.error('Load tasks error:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Add new task with backend API
  const addTask = async (taskData) => {
    setLoading(true);
    try {
      const newTask = await TaskAPI.createTask({
        ...taskData,
        category: taskData.category || 'personal',
        tags: typeof taskData.tags === 'string' 
          ? taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : taskData.tags || []
      });
      
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      console.error('Add task error:', err);
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  // Update task with backend API
  const updateTask = async (id, updates) => {
    setLoading(true);
    try {
      const updatedTask = await TaskAPI.updateTask(id, updates);
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
    } catch (err) {
      console.error('Update task error:', err);
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  // Delete task with backend API
  const deleteTask = async (id) => {
    setLoading(true);
    try {
      await TaskAPI.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error('Delete task error:', err);
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion with backend API
  const toggleTask = async (id) => {
    try {
      const updatedTask = await TaskAPI.toggleTask(id);
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
    } catch (err) {
      console.error('Toggle task error:', err);
      setError('Failed to update task');
    }
  };

  // Advanced filtering and search
  const handleAdvancedFilter = (filterType, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Filter tasks based on all criteria
  const filteredTasks = tasks.filter(task => {
    // Basic filter (all, active, completed)
    let matchesBasicFilter = true;
    switch (filter) {
      case 'active':
        matchesBasicFilter = !task.completed;
        break;
      case 'completed':
        matchesBasicFilter = task.completed;
        break;
      default:
        matchesBasicFilter = true;
    }

    // Search query filter
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Advanced filters
    const matchesCategory = advancedFilters.category === 'all' || task.category === advancedFilters.category;
    const matchesPriority = advancedFilters.priority === 'all' || task.priority === advancedFilters.priority;
    
    return matchesBasicFilter && matchesSearch && matchesCategory && matchesPriority;
  });

  // Clear error message
  const clearError = () => setError(null);

  // Handle logout
  const handleLogout = () => {
    logout();
    setTasks([]);
  };

  if (authLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-controls">
            <div></div>
            <ThemeToggle />
          </div>
          <h1>Task Manager Pro</h1>
          <p>// Stay organized and productive with style 🔥</p>
        </header>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="app">
      <NotificationSystem tasks={tasks} />
      <header className="app-header">
        <div className="header-controls">
          <div className="user-info">
            <span>Welcome, {user.firstName}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
          <ThemeToggle />
        </div>
        <h1>Task Manager Pro</h1>
        <p>// Stay organized and productive with style 🔥</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={clearError} className="error-close">×</button>
          </div>
        )}

        <TaskStats tasks={tasks} />

        <TaskSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdvancedFilter={handleAdvancedFilter}
          filters={advancedFilters}
        />

        <TaskForm onSubmit={addTask} loading={loading} />
        
        <div className="task-controls">
          <TaskFilter 
            currentFilter={filter} 
            onFilterChange={setFilter}
            taskCounts={{
              all: tasks.length,
              active: tasks.filter(t => !t.completed).length,
              completed: tasks.filter(t => t.completed).length
            }}
          />
        </div>

        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
          loading={loading}
        />

        {filteredTasks.length === 0 && !loading && tasks.length > 0 && (
          <div className="empty-state">
            <h3>No tasks match your filters</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {tasks.length === 0 && !loading && (
          <div className="empty-state">
            <h3>No tasks yet</h3>
            <p>Add your first task to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <TaskManager />
    </AuthProvider>
  );
}

export default App;