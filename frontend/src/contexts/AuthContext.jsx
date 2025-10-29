import React, { createContext, useContext, useEffect, useState } from 'react';
import { validateToken } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);



  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = validateToken(token);
      if (payload) {
        setIsAuthenticated(true);
        setUserRole(payload.user.role);
        setUser(payload.user);
        localStorage.setItem('userRole', payload.user.role);
        return true;
      } else {
        // Invalid or expired token
        clearAuth();
        return false;
      }
    } else {
      clearAuth();
      return false;
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    checkAuth();
  };

  const logout = () => {
    clearAuth();
  };

  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, []);

  const value = {
    isAuthenticated,
    userRole,
    user,
    isLoading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};