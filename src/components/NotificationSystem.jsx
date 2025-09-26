import React, { useState, useEffect } from 'react';

const NotificationSystem = ({ tasks }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    checkForNotifications();
    const interval = setInterval(checkForNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  const checkForNotifications = () => {
    const now = new Date();
    const newNotifications = [];

    tasks.forEach(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);

        // Notify for overdue tasks
        if (timeDiff < 0) {
          newNotifications.push({
            id: `overdue-${task.id}`,
            type: 'error',
            title: 'Task Overdue!',
            message: `\"${task.title}\" is overdue`,
            timestamp: now
          });
        }
        // Notify for tasks due in next 24 hours
        else if (hoursDiff <= 24) {
          newNotifications.push({
            id: `due-soon-${task.id}`,
            type: 'warning',
            title: 'Task Due Soon',
            message: `\"${task.title}\" is due ${hoursDiff < 1 ? 'within an hour' : `in ${Math.floor(hoursDiff)} hours`}`,
            timestamp: now
          });
        }
      }
    });

    setNotifications(prev => {
      const existingIds = prev.map(n => n.id);
      const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
      return [...prev, ...uniqueNew].slice(-5); // Keep only last 5 notifications
    });
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
          </div>
          <button
            onClick={() => dismissNotification(notification.id)}
            className="notification-close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;