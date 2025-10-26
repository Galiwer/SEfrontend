import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authApi } from '../api/auth';
import { api } from '../api/api';

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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userType, setUserType] = useState(localStorage.getItem('userType')); // 'admin' or 'customer'

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token && userType) {
        try {
          if (userType === 'admin') {
            const userData = await authApi.getCurrentUser();
            setUser(userData);
          } else if (userType === 'customer') {
            // For customers, we'll store user data in localStorage
            const userData = JSON.parse(localStorage.getItem('customerUser') || 'null');
            setUser(userData);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token, userType]);

  const login = async (usernameOrEmail, password) => {
    // Try admin login first
    try {
      const response = await authApi.login(usernameOrEmail, password);
      
      const { token: newToken, ...userData } = response;
      setToken(newToken);
      setUser(userData);
      setUserType('admin');
      localStorage.setItem('token', newToken);
      localStorage.setItem('userType', 'admin');
      
      return { success: true, userType: 'admin' };
    } catch (adminError) {
      // If admin login fails, try customer login
      try {
        const response = await api.loginCustomer({ email: usernameOrEmail, password });
        
        const { token: newToken, ...userData } = response.data;
        setToken(newToken);
        setUser(userData);
        setUserType('customer');
        localStorage.setItem('token', newToken);
        localStorage.setItem('userType', 'customer');
        localStorage.setItem('customerUser', JSON.stringify(userData));
        
        return { success: true, userType: 'customer' };
      } catch (customerError) {
        // Both logins failed
        return { 
          success: false, 
          error: 'Invalid credentials. Please check your username/email and password.' 
        };
      }
    }
  };

  // Keep the separate functions for backward compatibility
  const loginAdmin = async (usernameOrEmail, password) => {
    try {
      const response = await authApi.login(usernameOrEmail, password);
      
      const { token: newToken, ...userData } = response;
      setToken(newToken);
      setUser(userData);
      setUserType('admin');
      localStorage.setItem('token', newToken);
      localStorage.setItem('userType', 'admin');
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Admin login failed' 
      };
    }
  };

  const loginCustomer = async (email, password) => {
    try {
      const response = await api.loginCustomer({ email, password });
      
      const { token: newToken, ...userData } = response.data;
      setToken(newToken);
      setUser(userData);
      setUserType('customer');
      localStorage.setItem('token', newToken);
      localStorage.setItem('userType', 'customer');
      localStorage.setItem('customerUser', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Customer login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authApi.register(username, email, password);
      
      const { token: newToken, ...userData } = response;
      setToken(newToken);
      setUser(userData);
      setUserType('admin');
      localStorage.setItem('token', newToken);
      localStorage.setItem('userType', 'admin');
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const registerCustomer = async (customerData) => {
    try {
      const response = await api.registerCustomer(customerData);
      
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('customerUser');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => {
    return userType === 'admin' && user?.role === 'ADMIN';
  };

  const isCustomer = () => {
    return userType === 'customer';
  };

  const value = {
    user,
    token,
    loading,
    userType,
    login,
    loginAdmin,
    loginCustomer,
    register,
    registerCustomer,
    logout,
    isAdmin,
    isCustomer,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
