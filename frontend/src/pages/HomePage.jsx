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
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-teal-600 hover:rotate-12 transition-transform duration-300" />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">E-Placement Hub</h1>
                <p className="text-sm text-gray-600">APSIT COMPUTER DEPARTMENT</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Screen */}
      <section className="flex items-center justify-center min-h-[calc(100vh-88px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 mb-12">
              Welcome to <span className="text-teal-600">E-Placement Hub</span>
            </h1>
            <div className="flex flex-col gap-10 justify-center items-center">
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center w-full max-w-4xl">
                <Link 
                  to="/login?role=student" 
                  className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold px-12 py-6 rounded-xl text-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl transition-all duration-300 shadow-lg transform hover:scale-105 hover:-translate-y-1 w-full lg:w-auto justify-center"
                >
                  Login as Student
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  to="/login?role=admin" 
                  className="group inline-flex items-center bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold px-12 py-6 rounded-xl text-xl hover:from-teal-700 hover:to-teal-800 hover:shadow-2xl transition-all duration-300 shadow-lg transform hover:scale-105 hover:-translate-y-1 w-full lg:w-auto justify-center"
                >
                  Login as Admin
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
              
              <div className="text-center w-full max-w-2xl">
                <p className="text-gray-600 mb-4 text-lg">Don't have an account?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    to="/signup?role=student" 
                    className="group inline-flex items-center border-2 border-blue-600 text-blue-600 font-semibold px-8 py-4 rounded-lg text-lg hover:bg-blue-600 hover:text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto justify-center"
                  >
                    Create Student Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link 
                    to="/signup?role=admin" 
                    className="group inline-flex items-center border-2 border-teal-600 text-teal-600 font-semibold px-8 py-4 rounded-lg text-lg hover:bg-teal-600 hover:text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto justify-center"
                  >
                    Create Admin Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
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
          <p className="text-gray-400 text-sm">COMPUTER DEPARTMENT - A. P. Shah Institute of Technology</p>
          <p className="text-gray-500 text-xs mt-1">© 2025 APSIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
