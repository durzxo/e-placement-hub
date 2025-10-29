// Authentication utilities and axios interceptor setup
import axios from 'axios';

// Set up axios interceptors for automatic token handling
export const setupAxiosInterceptors = () => {
  console.log('Setting up axios interceptors');
  
  // Clear any existing interceptors first
  axios.interceptors.request.clear();
  axios.interceptors.response.clear();

  // Request interceptor - automatically add token to requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle token expiration
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('Response interceptor error:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        console.log('Token expired, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Validate JWT token
export const validateToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    if (payload.exp < currentTime) {
      return false; // Token expired
    }
    return payload;
  } catch (error) {
    return false; // Invalid token
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  return validateToken(token) !== false;
};

// Get user info from token
export const getUserInfo = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = validateToken(token);
  return payload ? payload.user : null;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  window.location.href = '/login';
};