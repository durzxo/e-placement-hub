import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockDrives } from '../data/mockDrives.js';
import { ArrowLeft, Upload, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const ManageDrivePage = () => {
  const { driveId } = useParams();
  const driveData = mockDrives.find(d => d.driveId === parseInt(driveId));

  const [students, setStudents] = useState([]);

  // Define standard round names for consistent display
  const roundNames = ['aptitude', 'technical', 'hr', 'onlineAssessment', 'caseStudy', 'finalInterview', 'technicalTest', 'managerialRound', 'groupDiscussion'];
  const roundDisplayNames = {
    'aptitude': 'Aptitude',
    'technical': 'Technical',
    'hr': 'HR',
    'onlineAssessment': 'Online Assessment',
    'caseStudy': 'Case Study',
    'finalInterview': 'Final Interview',
    'technicalTest': 'Technical Test',
    'managerialRound': 'Managerial Round',
    'groupDiscussion': 'Group Discussion'
  };

  useEffect(() => {
    if (driveData) {
      setStudents(driveData.registeredStudents);
    }
  }, [driveData]);

  const handleStatusChange = (studentId, round, newStatus) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, progress: { ...student.progress, [roundDisplayNames[round]]: newStatus } }
          : student
      )
    );
  };
  
  const handleFinalStatusChange = (studentId, newStatus) => {
     setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, finalStatus: newStatus }
          : student
      )
    );
  };

  if (!driveData) {
    return (
      <motion.div 
        className="p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">Drive not found.</h2>
        <Link to="/drives" className="text-teal-600 hover:underline mt-4 inline-block transition-colors duration-150">
          Back to all drives
        </Link>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link to="/drives" className="flex items-center text-teal-600 hover:text-teal-800 mb-4 sm:mb-6 font-medium transition-colors duration-150">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Drives
        </Link>
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div>
          <motion.h1 
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {driveData.companyName} - Drive Management
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-500 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Date: {driveData.driveDate}
          </motion.p>
        </div>
        <motion.div 
          className="flex flex-col sm:flex-row gap-2 sm:gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
            <motion.button 
              className="flex items-center justify-center bg-gray-200 text-gray-800 font-semibold py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-300 hover:shadow-md transition-all duration-200 text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Upload Students
            </motion.button>
            <motion.button 
              className="flex items-center justify-center bg-teal-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-sm hover:bg-teal-700 hover:shadow-md transition-all duration-200 text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Bulk Update
            </motion.button>
        </motion.div> 
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[150px] border-r border-gray-200">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">Superset ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Aptitude</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Technical</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">HR</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[140px]">Online Assessment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Case Study</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[140px]">Final Interview</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[140px]">Technical Test</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[150px]">Managerial Round</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[150px]">Group Discussion</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Final Status</th>
              </tr>
            </thead>
            <tbody>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {students.map(student => (
                  <motion.tr 
                    key={student.id} 
                    className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                    variants={rowVariants}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber}</td>
                    {roundNames.map(round => (
                      <td key={round} className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]">
                        <motion.select
                          value={student.progress[roundDisplayNames[round]] || 'Registered'}
                          onChange={(e) => handleStatusChange(student.id, round, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                          whileFocus={{ scale: 1.05 }}
                        >
                          <option>Registered</option>
                          <option>Appeared</option>
                          <option>Cleared</option>
                          <option>Not Cleared</option>
                        </motion.select>
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]">
                        <motion.select
                          value={student.finalStatus || 'Pending'}
                          onChange={(e) => handleFinalStatusChange(student.id, e.target.value)}
                          className={`w-full p-2 border rounded-md focus:ring-2 focus:border-teal-500 transition-all duration-200 ${student.finalStatus === 'Selected' ? 'bg-green-100 border-green-400 focus:ring-green-500' : student.finalStatus === 'Not Selected' ? 'bg-red-100 border-red-400 focus:ring-red-500' : 'border-gray-300'}`}
                          whileFocus={{ scale: 1.05 }}
                        >
                          <option>Pending</option>
                          <option>Selected</option>
                          <option>Not Selected</option>
                        </motion.select>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ManageDrivePage;

