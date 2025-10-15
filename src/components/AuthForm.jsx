import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthForm = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
          login(user);
        } else {
          setError('Invalid email or password');
        }
      } else {
        // For registration, we create a new user
        let users = JSON.parse(localStorage.getItem('taskManager_users') || '[]');
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === formData.email || u.username === formData.username);
        if (existingUser) {
          setError('User with this email or username already exists');
          setLoading(false);
          return;
        }
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('taskManager_users', JSON.stringify(users));
        login(newUser); // Automatically log in the new user
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: ''
    });
  };

  // Function to set up demo user
  const setupDemoUser = () => {
    const demoUser = {
      id: 'demo_user_id',
      email: 'demo@taskmanager.com',
      password: 'demo123',
      username: 'demo',
      firstName: 'Demo',
      lastName: 'User',
      createdAt: new Date().toISOString()
    };
    
    // Check if demo user already exists
    let users = JSON.parse(localStorage.getItem('taskManager_users') || '[]');
    const existingDemoUser = users.find(u => u.email === 'demo@taskmanager.com');
    
    if (!existingDemoUser) {
      users.push(demoUser);
      localStorage.setItem('taskManager_users', JSON.stringify(users));
    }
    
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