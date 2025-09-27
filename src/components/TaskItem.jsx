import React, { useState } from 'react';

const TaskItem = ({ task, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim()
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const isPastDue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isPastDue ? 'overdue' : ''} priority-${task.priority}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
      </div>

      <div className="task-content">
        {isEditing ? (
          <div className="task-edit">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="edit-description"
              rows="2"
            />
            <div className="edit-actions">
              <button onClick={handleSave} className="btn btn-small btn-primary">
                Save
              </button>
              <button onClick={handleCancel} className="btn btn-small btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="task-display">
            <h3 className="task-title">{task.title}</h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <div className="task-meta">
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority}
              </span>
              {task.category && (
                <span className={`category-badge category-${task.category}`}>
                  {task.category}
                </span>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              {task.dueDate && (
                <span className={`due-date ${isPastDue ? 'overdue' : ''}`}>
                  Due: {formatDate(task.dueDate)}
                </span>
              )}
              <span className="created-date">
                Created: {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="task-actions">
        {!isEditing && (
          <>
            <button
              onClick={handleEdit}
              className="btn btn-small btn-secondary"
              disabled={task.completed}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="btn btn-small btn-danger"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;