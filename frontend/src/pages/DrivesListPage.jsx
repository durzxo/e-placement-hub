import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AddDriveModal from '../components/AddDriveModal';

const DrivesListPage = () => {
  const [drives, setDrives] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDrives = async () => {
    try {
      const response = await axios.get('/api/drives');
      setDrives(response.data);
    } catch (error) {
      console.error('Failed to fetch drives:', error);
      alert('Failed to fetch drives.');
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="p-4 sm:p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">Placement Drives</h1>
          <motion.button 
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 text-white py-2 px-5 rounded-lg shadow-sm font-semibold hover:bg-teal-700 hover:shadow-md transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Drive
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {drives.length > 0 ? (
            drives.map(drive => (
              <motion.div
                key={drive._id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to={`/drives/details/${drive._id}`}>
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 hover:border-teal-500 transition-all duration-300 h-full">
                    <motion.h2 
                      className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {drive.companyName}
                    </motion.h2>
                    <motion.p 
                      className="text-teal-700 font-semibold text-sm sm:text-base mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {drive.jobTitle}
                    </motion.p>
                    <motion.div 
                      className="space-y-1 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-xs sm:text-sm text-gray-500">CTC: {drive.salary}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}</p>
                    </motion.div>
                    <motion.span 
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          drive.status === 'Active' ? 'bg-green-100 text-green-800' :
                          drive.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      {drive.status}
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-full flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No placement drives found</h3>
              <p className="text-gray-500 text-center">Click "Add Drive" to create your first placement drive.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <AddDriveModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDriveAdded={fetchDrives}
      />
    </motion.div>
  );
};

export default DrivesListPage;