import React from 'react';
import '../Styles/TaskFilter.css';

// Task filter component that allows users to filter tasks by status
const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }) => {
  // Define filter options with their labels and task counts
  const filters = [
    { key: 'all', label: 'All', count: taskCounts.all },
    { key: 'active', label: 'Active', count: taskCounts.active },
    { key: 'completed', label: 'Completed', count: taskCounts.completed }
  ];

  return (
    <div className="task-filter">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`filter-btn ${currentFilter === filter.key ? 'active' : ''}`}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;