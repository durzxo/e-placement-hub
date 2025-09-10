import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-300 ${
      isActive ? 'bg-teal-100 text-teal-700 shadow-md' : 'hover:bg-gray-100 hover:shadow-sm hover:scale-105'
    }`;

  return (
    <motion.div 
      className="w-64 bg-white border-r border-gray-200 flex flex-col"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b">
        <motion.h1 
          className="text-2xl font-bold text-teal-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          E-Placement Portal
        </motion.h1>
        <p className="text-sm text-gray-500">CS Department</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <NavLink to="/dashboard" className={navLinkClasses}>
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <NavLink to="/students" className={navLinkClasses}>
            <Users className="w-5 h-5 mr-3" />
            Students
          </NavLink>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <NavLink to="/drives" className={navLinkClasses}>
            <Briefcase className="w-5 h-5 mr-3" />
            Drives
          </NavLink>
        </motion.div>
      </nav>
      <div className="p-4 border-t">
        <motion.button 
          onClick={handleLogout} 
          className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

const Layout = ({ children, onLogout }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar onLogout={onLogout} />
    <motion.main 
      className="flex-1 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.main>
  </div>
);
export default Layout;