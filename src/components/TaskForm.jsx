import React, { useState } from 'react';
import '../Styles/TaskForm.css';

// Task form component for creating new tasks
const TaskForm = ({ onSubmit, loading }) => {
  // State hooks for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('personal');
  const [tags, setTags] = useState('');

  // Handle form submission to create a new task
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Don't submit if title is empty
    if (!title.trim()) return;

    // Call the onSubmit function passed from parent component with task data
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      category,
      // Process tags: split by comma, trim whitespace, and filter out empty tags
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });

    // Reset form fields after submission
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setCategory('personal');
    setTags('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="form-group">
        <textarea
          placeholder="Task description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={loading}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Tags (comma separated)..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={loading || !title.trim()}
      >
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;