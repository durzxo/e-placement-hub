// ...existing code...
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Extract role from localStorage if present, else null
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserRole(null);
  };
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/dashboard" element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout} userRole={userRole}>
              <DashboardPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/offer-letter" element={
          isAuthenticated && userRole === 'student' ? (
            <Layout onLogout={handleLogout} userRole={userRole}>
              <OfferLetterPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/notices" element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout} userRole={userRole}>
              <NoticesPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/students" element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout} userRole={userRole}>
              <StudentsPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/drives" element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout} userRole={userRole}>
              <DrivesListPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/company/:companyId" element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout} userRole={userRole}>
              <CompanyDetailPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/drives/manage/:driveId" element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout} userRole={userRole}>
              <ManageDrivePage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/drives/details/:id" element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout} userRole={userRole}>
              <DriveDetailPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;