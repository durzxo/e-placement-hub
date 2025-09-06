import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// --- Auth Pages ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// --- Dashboard Pages ---
const DashboardPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Dashboard (by Purvika)</h1></div>;

// --- Management Pages ---
import StudentsPage from './pages/StudentsPage';
import DrivesListPage from './pages/DrivesListPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import ManageDrivePage from './pages/ManageDrivePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUpPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <Layout>
              <DashboardPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/students" element={
          isAuthenticated ? (
            <Layout>
              <StudentsPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/drives" element={
          isAuthenticated ? (
            <Layout>
              <DrivesListPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/company/:companyId" element={
          isAuthenticated ? (
            <Layout>
              <CompanyDetailPage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="/drives/manage/:driveId" element={
          isAuthenticated ? (
            <Layout>
              <ManageDrivePage />
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;