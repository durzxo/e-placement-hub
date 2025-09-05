import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// --- Placeholder Pages ---
const LoginPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Login Page (by Aradhya)</h1></div>;
const RegisterPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Register Page (by Aradhya)</h1></div>;
const DashboardPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Dashboard (by Purvika)</h1></div>;
const StudentsPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Students Page (by Aryan)</h1></div>;

// --- Your Pages ---
import DrivesListPage from './pages/DrivesListPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import ManageDrivePage from './pages/ManageDrivePage';

function App() {
  const isAuthenticated = true;
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={
          isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/drives" element={<DrivesListPage />} />
                <Route path="/company/:companyId" element={<CompanyDetailPage />} />
                <Route path="/drives/manage/:driveId" element={<ManageDrivePage />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          ) : (<Navigate to="/login" />)
        }/>
      </Routes>
    </Router>
  );
}
export default App;