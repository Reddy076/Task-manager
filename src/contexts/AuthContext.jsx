import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize users storage if it doesn't exist
    if (!localStorage.getItem('taskManager_users')) {
      localStorage.setItem('taskManager_users', JSON.stringify([]));
    }
    
    // Create demo user if it doesn't exist
    let users = JSON.parse(localStorage.getItem('taskManager_users') || '[]');
    const existingDemoUser = users.find(u => u.email === 'demo@taskmanager.com');
    
    if (!existingDemoUser) {
      const demoUser = {
        id: 'demo_user_id',
        email: 'demo@taskmanager.com',
        password: 'demo123',
        username: 'demo',
        firstName: 'Demo',
        lastName: 'User',
        createdAt: new Date().toISOString()
      };
      
      users.push(demoUser);
      localStorage.setItem('taskManager_users', JSON.stringify(users));
    }
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('taskManager_user');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('taskManager_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Save the user data to localStorage
    localStorage.setItem('taskManager_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = (userData) => {
    // For registration, we create a new user and log them in
    let users = JSON.parse(localStorage.getItem('taskManager_users') || '[]');
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('taskManager_users', JSON.stringify(users));
    
    // Log in the new user
    login(newUser);
  };

  const logout = () => {
    localStorage.removeItem('taskManager_user');
    localStorage.removeItem('taskManager_tasks'); // Optionally clear tasks on logout
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;