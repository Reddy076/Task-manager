import React from 'react';

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }) => {
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