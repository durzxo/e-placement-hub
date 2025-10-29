import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { setupAxiosInterceptors } from './utils/auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// --- Auth Pages ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import OfferLetterPage from './pages/OfferLetterPage';
import NoticesPage from './pages/NoticesPage';

// --- Dashboard Pages ---

import StudentsPage from './pages/StudentsPage';
import DrivesListPage from './pages/DrivesListPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import ManageDrivePage from './pages/ManageDrivePage';
import DriveDetailPage from './pages/DriveDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SelectedStudentsPage from './pages/SelectedStudentsPage';

const AppContent = () => {
  const { isAuthenticated, userRole, isLoading, logout } = useAuth();



  React.useEffect(() => {
    // Setup axios interceptors
    setupAxiosInterceptors();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/dashboard" element={
          isAuthenticated ? (
            <Layout onLogout={logout} userRole={userRole}>
              <DashboardPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/offer-letter" element={
          isAuthenticated && userRole === 'student' ? (
            <Layout onLogout={logout} userRole={userRole}>
              <OfferLetterPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/notices" element={
          isAuthenticated ? (
            <Layout onLogout={logout} userRole={userRole}>
              <NoticesPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/students" element={
          isAuthenticated ? (
            <Layout onLogout={logout} userRole={userRole}>
              <StudentsPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/drives" element={
          isAuthenticated ? (
            <Layout onLogout={logout} userRole={userRole}>
              <DrivesListPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/company/:companyId" element={
          isAuthenticated ? (
            <Layout onLogout={logout} userRole={userRole}>
              <CompanyDetailPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/drives/manage/:driveId" element={
          isAuthenticated ? (
            <Layout onLogout={logout} userRole={userRole}>
              <ManageDrivePage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/drives/details/:id" element={
          isAuthenticated ? (
            <Layout onLogout={logout} userRole={userRole}>
              <DriveDetailPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={
          isAuthenticated && userRole === 'admin' ? (
            <Layout onLogout={logout} userRole={userRole}>
              <AdminDashboardPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>

        {/* Selected Students Page for Admin */}
        <Route path="/selected-students" element={
          isAuthenticated && userRole === 'admin' ? (
            <Layout onLogout={logout} userRole={userRole}>
              <SelectedStudentsPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;