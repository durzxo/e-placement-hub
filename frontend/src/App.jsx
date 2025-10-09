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
  
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/dashboard" element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                {localStorage.getItem('userRole') === 'admin' ? <AdminDashboardPage /> : <DashboardPage />}
              </Layout>
            ) : (<Navigate to="/login" />)
        }/>
        <Route path="/offer-letter" element={
          isAuthenticated ? (
            localStorage.getItem('userRole') === 'student'
              ? <Layout onLogout={handleLogout}><OfferLetterPage /></Layout>
              : <Layout onLogout={handleLogout}><div className="flex items-center justify-center h-full text-xl text-red-600">Access Denied: Only students can view this page.</div></Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/notices" element={
          isAuthenticated ? ( <Layout onLogout={handleLogout}><NoticesPage /></Layout> ) : (<Navigate to="/login" />)
        }/>
        <Route path="/students" element={
          isAuthenticated ? (
            localStorage.getItem('userRole') === 'admin'
              ? <Layout onLogout={handleLogout}><StudentsPage /></Layout>
              : <Layout onLogout={handleLogout}><div className="flex items-center justify-center h-full text-xl text-red-600">Access Denied: Students cannot view this page.</div></Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/drives" element={
          isAuthenticated ? (
            localStorage.getItem('userRole') === 'admin'
              ? <Layout onLogout={handleLogout}><DrivesListPage /></Layout>
              : <Layout onLogout={handleLogout}><div className="flex items-center justify-center h-full text-xl text-red-600">Access Denied: Students cannot view this page.</div></Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/company/:companyId" element={
          isAuthenticated ? ( <Layout onLogout={handleLogout}><CompanyDetailPage /></Layout> ) : (<Navigate to="/login" />)
        }/>
        <Route path="/drives/manage/:driveId" element={
          isAuthenticated ? ( <Layout onLogout={handleLogout}><ManageDrivePage /></Layout> ) : (<Navigate to="/login" />)
        }/>
        
        {/* ADD THIS NEW ROUTE */}
        <Route path="/drives/details/:id" element={
          isAuthenticated ? ( <Layout onLogout={handleLogout}><DriveDetailPage /></Layout> ) : (<Navigate to="/login" />)
        }/>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;