import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center ml-4">
              <GraduationCap className="h-8 w-8 text-teal-600 hover:rotate-12 transition-transform duration-300" />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">E-Placement Hub</h1>
                <p className="text-sm text-gray-600">Computer Department</p>
              </div>
            </div>
            <div className="flex space-x-4 mr-4">
              <Link 
                to="/login" 
                className="text-teal-600 hover:text-teal-800 font-medium px-4 py-2 rounded-lg transition-colors duration-150"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-teal-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-700 hover:shadow-md transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Screen */}
      <section className="flex items-center justify-center min-h-[calc(100vh-88px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 mb-8">
              Welcome to <span className="text-teal-600">E-Placement Hub</span>
            </h1>
            <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Streamline your placement process with our comprehensive portal designed specifically 
              for the Computer Department. Connect students with opportunities and manage recruitment drives efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/login" 
                className="inline-flex items-center bg-teal-600 text-white font-semibold px-10 py-5 rounded-lg text-xl hover:bg-teal-700 hover:shadow-lg transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
              <Link 
                to="/signup" 
                className="inline-flex items-center border-2 border-teal-600 text-teal-600 font-semibold px-10 py-5 rounded-lg text-xl hover:bg-teal-600 hover:text-white hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <GraduationCap className="h-5 w-5 text-teal-400 hover:rotate-12 transition-transform duration-300" />
            <span className="ml-2 font-semibold">E-Placement Hub</span>
          </div>
          <p className="text-gray-400 text-sm">Computer Department - A. P. Shah Institute of Technology</p>
          <p className="text-gray-500 text-xs mt-1">© 2025 APSIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
