import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockDrives } from '../data/mockDrives.js';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyDetailPage = () => {
  const { companyId } = useParams();
  const companyDrives = mockDrives.filter(d => d.companyId === parseInt(companyId));

  if (companyDrives.length === 0) {
    return (
      <motion.div 
        className="p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">Company not found.</h2>
        <Link to="/drives" className="text-teal-600 hover:underline mt-4 inline-block transition-colors duration-150">
          Back to all drives
        </Link>
      </motion.div>
    );
  }

  const companyDetails = companyDrives[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
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
      className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/drives" className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-6 font-medium transition-colors duration-150">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Drives
          </Link>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Header Section - Fixed Layout */}
          <motion.div
            className="p-6 sm:p-8 border-b border-gray-200"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <motion.h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 break-words"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {companyDetails.companyName}
                </motion.h1>
                <motion.a
                  href={`http://${companyDetails.companyWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors duration-150 text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                >
                  {companyDetails.companyWebsite}
                  <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                </motion.a>
              </div>
              <motion.div
                className="flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <motion.img
                  src={companyDetails.companyLogo}
                  alt={`${companyDetails.companyName} Logo`}
                  className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain rounded-lg border border-gray-200"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Content Section - Improved Grid */}
          <motion.div
            className="p-6 sm:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <motion.div
                className="lg:col-span-1 order-2 lg:order-1"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">About Company</h2>
                <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {companyDetails.companyDescription}
                </div>
              </motion.div>

              <motion.div
                className="lg:col-span-1 order-1 lg:order-2"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">Drives Conducted</h2>
                <div className="overflow-x-auto">
                  <table className="w-full bg-gray-50 rounded-lg border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Drive Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyDrives.map((drive, index) => (
                        <motion.tr
                          key={drive.driveId}
                          className="hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <td className="px-4 py-3 text-sm text-gray-800 font-medium">{drive.driveDate}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              drive.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              drive.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {drive.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompanyDetailPage;

