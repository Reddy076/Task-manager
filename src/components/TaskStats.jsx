import React from 'react';
import '../Styles/TaskStats.css';

// Task statistics component that displays task metrics and statistics
const TaskStats = ({ tasks }) => {
  // Calculate various task statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    // Count overdue tasks (not completed and past due date)
    overdue: tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < new Date() && 
      !t.completed
    ).length
  };

  // Calculate completion rate percentage
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-dashboard">
      <div className="stat-card">
        <div className="stat-number">{stats.total}</div>
        <div className="stat-label">Total Tasks</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{stats.active}</div>
        <div className="stat-label">Active</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{stats.completed}</div>
        <div className="stat-label">Completed</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number">{completionRate}%</div>
        <div className="stat-label">Completion</div>
      </div>
      
      {stats.overdue > 0 && (
        <div className="stat-card overdue">
          <div className="stat-number">{stats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      )}
    </div>
  );
};

export default TaskStats;