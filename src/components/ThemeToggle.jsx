import React, { useState, useEffect } from 'react';
import '../Styles/ThemeToggle.css';

// Theme toggle component that allows users to switch between light and dark themes
const ThemeToggle = () => {
  // State to track whether dark theme is currently active
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  // Load saved theme preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      // Use saved theme preference
      const isDarkTheme = savedTheme === 'dark';
      setIsDark(isDarkTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to dark theme if no saved preference
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    // Determine the new theme based on current theme
    const newTheme = isDark ? 'light' : 'dark';
    // Update state to reflect the new theme
    setIsDark(!isDark);
    // Apply the new theme to the document
    document.documentElement.setAttribute('data-theme', newTheme);
    // Save the new theme preference to localStorage
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDark ? '☀️' : '🌙'}
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default ThemeToggle;