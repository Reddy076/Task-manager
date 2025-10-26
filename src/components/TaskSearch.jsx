import React from 'react';
import '../Styles/TaskSearch.css';

// Task search and filter component that allows users to search and filter tasks
const TaskSearch = ({ searchQuery, onSearchChange, onAdvancedFilter, filters }) => {
  return (
    <div className="search-filter-section">
      {/* Search input field */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {/* Advanced filters for category and priority */}
      <div className="advanced-filters">
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select 
            className="filter-select"
            value={filters.category}
            onChange={(e) => onAdvancedFilter('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Priority</label>
          <select 
            className="filter-select"
            value={filters.priority}
            onChange={(e) => onAdvancedFilter('priority', e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskSearch;