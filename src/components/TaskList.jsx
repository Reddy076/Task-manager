import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggle, onUpdate, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="task-list loading">
        <div className="loading-spinner">Loading tasks...</div>
      </div>
    );
  }

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