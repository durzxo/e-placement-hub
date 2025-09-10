import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const DriveDetailPage = () => {
  const { id: driveId } = useParams();
  const [drive, setDrive] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const roundNames = ['aptitude', 'technical', 'hr', 'onlineAssessment', 'caseStudy', 'finalInterview', 'technicalTest', 'managerialRound', 'groupDiscussion', 'finalStatus'];
  const roundDisplayNames = {
    'aptitude': 'Aptitude',
    'technical': 'Technical',
    'hr': 'HR',
    'onlineAssessment': 'Online Assessment',
    'caseStudy': 'Case Study',
    'finalInterview': 'Final Interview',
    'technicalTest': 'Technical Test',
    'managerialRound': 'Managerial Round',
    'groupDiscussion': 'Group Discussion',
    'finalStatus': 'Final Status'
  };
  const statusOptions = ['Registered', 'Appeared', 'Cleared', 'Not Cleared', 'In Progress', 'Selected', 'Not Selected', 'N/A'];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [driveRes, applicantsRes] = await Promise.all([
        axios.get(`/api/drives/${driveId}`),
        axios.get(`/api/drives/${driveId}/applicants`)
      ]);
      setDrive(driveRes.data);
      setApplicants(applicantsRes.data);
    } catch (error) {
      console.error('Failed to fetch drive details:', error);
      alert('Failed to load drive data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [driveId]);

  const handleStatusChange = async (studentId, roundName, newStatus) => {
    try {
      await axios.put(`/api/drives/${driveId}/applicants/${studentId}`, {
        roundName,
        status: newStatus,
      });
      setApplicants(prevApplicants =>
        prevApplicants.map(app =>
          app.studentId === studentId
            ? { ...app, activity: { ...app.activity, rounds: { ...app.activity.rounds, [roundName]: newStatus } } }
            : app
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status.');
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p 
          className="ml-4 text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading drive details...
        </motion.p>
      </motion.div>
    );
  }

  if (!drive) {
    return (
      <motion.div 
        className="p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">Drive not found.</h2>
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
      <div className="max-w-full mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/drives" className="text-teal-600 hover:text-teal-800 mb-4 inline-block transition-colors duration-150">&larr; Back to all drives</Link>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1 
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {drive.companyName}
          </motion.h1>
          <motion.h2 
            className="text-xl text-teal-700 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {drive.jobTitle}
          </motion.h2>
          <motion.p 
            className="text-gray-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {drive.jobDescription}
          </motion.p>
        </motion.div>
        
        <motion.h3 
          className="text-2xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Applicants
        </motion.h3>
        
        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[150px] border-r border-gray-200">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">Roll No</th>
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
              <tbody className="bg-white divide-y divide-gray-200">
                {applicants && applicants.length > 0 ? (
                  applicants.map((applicant, index) => (
                    <motion.tr 
                      key={applicant.studentId || index}
                      variants={rowVariants}
                      className="hover:bg-gray-50 transition-colors duration-150"
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 * index }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">{applicant.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.rollNumber}</td>
                      {roundNames.slice(0, -1).map(round => (
                        <td key={round} className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]">
                          <motion.select
                            value={applicant.activity?.rounds?.[round] || 'N/A'}
                            onChange={(e) => handleStatusChange(applicant.studentId, round, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                            whileFocus={{ scale: 1.05 }}
                          >
                            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </motion.select>
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]">
                        <motion.select
                          value={applicant.activity?.rounds?.finalStatus || 'N/A'}
                          onChange={(e) => handleStatusChange(applicant.studentId, 'finalStatus', e.target.value)}
                          className={`w-full p-2 border rounded-md text-xs focus:ring-2 transition-all duration-200 ${
                            applicant.activity?.rounds?.finalStatus === 'Selected' ? 'bg-green-100 border-green-400 focus:ring-green-500' :
                            applicant.activity?.rounds?.finalStatus === 'Not Selected' ? 'bg-red-100 border-red-400 focus:ring-red-500' :
                            'border-gray-300 focus:ring-teal-500'
                          }`}
                          whileFocus={{ scale: 1.05 }}
                        >
                          <option value="N/A">N/A</option>
                          <option value="Pending">Pending</option>
                          <option value="Selected">Selected</option>
                          <option value="Not Selected">Not Selected</option>
                        </motion.select>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="px-6 py-8 text-center text-sm text-gray-500">
                      No applicants found for this drive.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DriveDetailPage;