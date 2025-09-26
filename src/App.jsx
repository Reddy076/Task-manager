import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import TaskSearch from './components/TaskSearch';
import TaskStats from './components/TaskStats';
import ThemeToggle from './components/ThemeToggle';
import NotificationSystem from './components/NotificationSystem';
import './App.css';

function App() {
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

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Mock API service - in a real app, this would be actual API calls
  const loadTasks = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load from localStorage for persistence
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Save tasks to localStorage (simulating API)
  const saveTasks = (updatedTasks) => {
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Add new task with category and tags
  const addTask = async (taskData) => {
    setLoading(true);
    try {
      const newTask = {
        id: Date.now(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: taskData.category || 'personal',
        tags: taskData.tags || []
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    } catch (err) {
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const updateTask = async (id, updates) => {
    setLoading(true);
    try {
      const updatedTasks = tasks.map(task =>
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    setLoading(true);
    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
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
    
    // Due date filter
    let matchesDueDate = true;
    if (advancedFilters.dueDate !== 'all' && task.dueDate) {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      switch (advancedFilters.dueDate) {
        case 'today':
          matchesDueDate = taskDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          matchesDueDate = taskDate.toDateString() === tomorrow.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          matchesDueDate = taskDate <= weekFromNow && taskDate >= today;
          break;
        case 'overdue':
          matchesDueDate = taskDate < today && !task.completed;
          break;
        default:
          matchesDueDate = true;
      }
    }

    return matchesBasicFilter && matchesSearch && matchesCategory && matchesPriority && matchesDueDate;
  });

  // Clear error message
  const clearError = () => setError(null);

  return (
    <div className="app">
      <NotificationSystem tasks={tasks} />
      <header className="app-header">
        <div className="header-controls">
          <div></div>
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
}

export default App;