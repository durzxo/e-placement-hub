import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  // Remove role from URL, will get from backend
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      // Check if email looks like an admin email
      const isAdminEmail = formData.email.includes('admin') || 
                          formData.email.includes('hod') || 
                          formData.email.includes('placement');
      
      console.log('Login attempt:', { email: formData.email, isAdminEmail });
      
      if (isAdminEmail) {
        // Try admin login first
        try {
          console.log('Attempting admin login...');
          response = await axios.post('/api/admin/login', formData);
          console.log('Admin login successful:', response.data);
        } catch (adminError) {
          console.log('Admin login failed:', adminError.response?.data);
          // If admin login fails, try regular login as fallback
          if (adminError.response?.status === 401) {
            console.log('Trying regular login as fallback...');
            response = await axios.post('/api/users/login', formData);
          } else {
            throw adminError;
          }
        }
      } else {
        // Regular student login
        console.log('Attempting regular student login...');
        response = await axios.post('/api/users/login', formData);
        console.log('Student login successful:', response.data);
      }
      
      console.log('Storing token and user data...');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', formData.email);
      
      // Store user role for easy access
      if (response.data.user && response.data.user.role) {
        localStorage.setItem('userRole', response.data.user.role);
        console.log('User role stored:', response.data.user.role);
      }
      
      // Use AuthContext login method
      login(response.data.token);
      console.log('AuthContext login called');
      
      // Small delay to ensure auth context updates
      setTimeout(() => {
        // Redirect based on role from the response
        const userRole = response.data.user?.role;
        console.log('Redirecting user with role:', userRole);
        
        if (userRole === 'admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin-dashboard');
        } else {
          console.log('Redirecting to student dashboard');
          navigate('/dashboard');
        }
      }, 100);
      
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="flex justify-center">
            <div className="flex items-center">
              <GraduationCap className="h-12 w-12 text-teal-600" />
              <div className="ml-3 text-center">
                <h1 className="text-2xl font-bold text-gray-900">E-Placement Hub</h1>
                <p className="text-sm text-gray-600">COMPUTER DEPARTMENT</p>
              </div>
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Login</h2>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-20">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-600 transition-colors duration-150"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-150">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:scale-105 hover:shadow-teal-500/50"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;