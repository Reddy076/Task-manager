import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthForm = () => {
  const { login } = useAuth();
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
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitEndTime, setRateLimitEndTime] = useState(null);
  const [countdown, setCountdown] = useState(0);

  // Auto-dismiss non-rate-limit errors after 2 seconds
  useEffect(() => {
    if (error && !isRateLimited) {
      const timer = setTimeout(() => {
        setError('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, isRateLimited]);

  // Handle rate limit countdown
  useEffect(() => {
    if (isRateLimited && rateLimitEndTime) {
      const updateCountdown = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((rateLimitEndTime - now) / 1000));
        setCountdown(remaining);
        
        if (remaining <= 0) {
          setIsRateLimited(false);
          setRateLimitEndTime(null);
          setError('');
        }
      };
      
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [isRateLimited, rateLimitEndTime]);

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
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        login(data.data.user);
      } else {
        const errorMessage = data.message || 'Authentication failed';
        setError(errorMessage);
        
        // Check if it's a rate limiting error
        if (errorMessage.toLowerCase().includes('too many') || 
            errorMessage.toLowerCase().includes('rate limit') ||
            response.status === 429) {
          setIsRateLimited(true);
          // Set rate limit end time (15 minutes from now for login, 1 hour for registration)
          const rateLimitDuration = isLogin ? 15 * 60 * 1000 : 60 * 60 * 1000;
          setRateLimitEndTime(Date.now() + rateLimitDuration);
        } else {
          setIsRateLimited(false);
          setRateLimitEndTime(null);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Connection failed. Make sure the backend is running.');
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
          <div className={`error-message ${isRateLimited ? 'rate-limit-error' : ''}`}>
            {isRateLimited ? (
              <div>
                <div className="error-title">🚫 Rate Limited</div>
                <div className="error-text">
                  Too many attempts. Try again in: <strong>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</strong>
                </div>
              </div>
            ) : (
              error
            )}
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
        </div>
      </div>
    </div>
  );
};

export default AuthForm;