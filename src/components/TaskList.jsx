import React from 'react';
import TaskItem from './TaskItem';
import '../Styles/TaskList.css';

// Task list component that displays a list of tasks
const TaskList = ({ tasks, onToggle, onUpdate, onDelete, loading }) => {
  // Show loading spinner while tasks are being fetched
  if (loading) {
    return (
      <div className="task-list loading">
        <div className="loading-spinner">Loading tasks...</div>
      </div>
    );
  }

  // Render the list of tasks
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;