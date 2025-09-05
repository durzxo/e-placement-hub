import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100'
    }`;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-teal-700">Placement Portal</h1>
        <p className="text-sm text-gray-500">CS Department</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/dashboard" className={navLinkClasses}><LayoutDashboard className="w-5 h-5 mr-3" />Dashboard</NavLink>
        <NavLink to="/students" className={navLinkClasses}><Users className="w-5 h-5 mr-3" />Students</NavLink>
        <NavLink to="/drives" className={navLinkClasses}><Briefcase className="w-5 h-5 mr-3" />Drives</NavLink>
      </nav>
      <div className="p-4 border-t"><button className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"><LogOut className="w-5 h-5 mr-3" />Logout</button></div>
    </div>
  );
};

const Layout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">{children}</main>
  </div>
);
export default Layout;