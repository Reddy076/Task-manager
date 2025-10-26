import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/AuthForm.css';

// Authentication form component that handles both login and registration
const AuthForm = () => {
  // Get login and register functions from AuthContext
  const { login, register } = useAuth();
  
  // State to track whether we're in login or registration mode
  const [isLogin, setIsLogin] = useState(true);
  
  // State to manage form input values
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: ''
  });
  
  // State to track loading status during authentication
  const [loading, setLoading] = useState(false);
  
  // State to store and display error messages
  const [error, setError] = useState('');

  // Handle form input changes and update the formData state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission for both login and registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // For login, we check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('taskManager_users') || '[]');
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (user) {
          // If user exists, log them in
          login(user);
        } else {
          // If user doesn't exist or credentials are wrong, show error
          setError('Invalid email or password');
        }
      } else {
        // For registration, we create a new user
        let users = JSON.parse(localStorage.getItem('taskManager_users') || '[]');
        
        // Check if user already exists with the same email or username
        const existingUser = users.find(u => u.email === formData.email || u.username === formData.username);
        if (existingUser) {
          setError('User with this email or username already exists');
          setLoading(false);
          return;
        }
        
        // Create new user object with current form data
        const newUser = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        
        // Add new user to users array and save to localStorage
        users.push(newUser);
        localStorage.setItem('taskManager_users', JSON.stringify(users));
        login(newUser); // Automatically log in the new user
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication failed');
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  };

  // Toggle between login and registration modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    // Reset form data when switching modes
    setFormData({
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: ''
    });
  };

  // Function to set up demo user credentials for easy testing
  const setupDemoUser = () => {
    // Create demo user object with predefined credentials
    const demoUser = {
      id: 'demo_user_id',
      email: 'demo@taskmanager.com',
      password: 'demo123',
      username: 'demo',
      firstName: 'Demo',
      lastName: 'User',
      createdAt: new Date().toISOString()
    };
    
    // Check if demo user already exists in localStorage
    let users = JSON.parse(localStorage.getItem('taskManager_users') || '[]');
    const existingDemoUser = users.find(u => u.email === 'demo@taskmanager.com');
    
    // Add demo user to users array if it doesn't already exist
    if (!existingDemoUser) {
      users.push(demoUser);
      localStorage.setItem('taskManager_users', JSON.stringify(users));
    }
    
    // Pre-fill the form with demo credentials
    setFormData({
      email: 'demo@taskmanager.com',
      password: 'demo123',
      username: 'demo',
      firstName: 'Demo',
      lastName: 'User'
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin 
            ? 'Sign in to access your tasks' 
            : 'Join Task Manager Pro today'
          }
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="link-btn"
              onClick={toggleMode}
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="auth-demo">
          <p className="demo-info">🚀 Demo Credentials:</p>
          <p><strong>Email:</strong> demo@taskmanager.com</p>
          <p><strong>Password:</strong> demo123</p>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={setupDemoUser}
          >
            Fill Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;