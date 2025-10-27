import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const AddDriveModal = ({ isOpen, onClose, onDriveAdded }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    salary: '',
    jobLocation: 'Mumbai',
    minCGPA: '',
    driveDate: '',
    applicationDeadline: '',
    eligibilityCriteria: '',
    status: 'Upcoming'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- NEW: State to hold our validation error message ---
  const [dateError, setDateError] = useState('');

  // --- THIS LOGIC IS NOW FIXED ---
  // Gets today's date in YYYY-MM-DD format based on LOCAL time, not UTC
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  const minDate = `${year}-${month}-${day}`;
  // --- END OF FIX ---

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // --- NEW: Clear the error message as the user types ---
    if (dateError) {
      setDateError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- NEW VALIDATION BLOCK ---
    const { driveDate, applicationDeadline } = formData;
    
    // Check 1: Are dates in the past?
    if (driveDate < minDate || applicationDeadline < minDate) {
      setDateError('Drive Date and Application Deadline cannot be in the past.');
      return; // Stop the submission
    }

    // Check 2: Is the deadline after the drive date?
    if (applicationDeadline > driveDate) {
      setDateError('Application Deadline cannot be after the Drive Date.');
      return; // Stop the submission
    }
    
    setDateError(''); // Clear any old errors if all checks pass
    // --- END OF VALIDATION BLOCK ---


    setIsSubmitting(true);
    try {
      await axios.post('/api/drives', formData);
      alert('Drive added successfully!');
      onDriveAdded(); // This will tell the parent page to refresh its list of drives
      onClose(); // This will close the modal
      // Reset form
      setFormData({
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        salary: '',
        jobLocation: 'Mumbai',
        minCGPA: '',
        driveDate: '',
        applicationDeadline: '',
        eligibilityCriteria: '',
        status: 'Upcoming'
      });
    } catch (error) {
      console.error('Failed to add drive:', error.response.data);
      alert(`Failed to add drive: ${error.response.data.message || 'Server Error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <motion.h2 
                  className="text-2xl font-bold text-gray-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Add New Placement Drive
                </motion.h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input 
                      type="text" 
                      name="companyName" 
                      placeholder="Enter company name" 
                      onChange={handleChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200" 
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input 
                      type="text" 
                      name="jobTitle" 
                      placeholder="Enter job title" 
                      onChange={handleChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200" 
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary / CTC</label>
                    <input 
                      type="text" 
                      name="salary" 
                      placeholder="e.g., 8 LPA" 
                      onChange={handleChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200" 
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Location</label>
                    <input 
                      type="text" 
                      name="jobLocation" 
                      placeholder="Enter job location" 
                      onChange={handleChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200" 
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum CGPA</label>
                    <input 
                      type="number" 
                      name="minCGPA" 
                      placeholder="7.0" 
                      step="0.01" 
                      onChange={handleChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200" 
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      name="status" 
                      onChange={handleChange} 
                      value={formData.status} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Drive Date</label>
                    <input 
                      type="date" 
                      name="driveDate" 
                      value={formData.driveDate}
                      onChange={handleChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200" 
                      min={minDate}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                    <input 
                      type="date" 
                      name="applicationDeadline" 
                      value={formData.applicationDeadline}
                      onChange={handleChange} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200" 
                      min={minDate}
                    />
                  </motion.div>
                </div>

                {/* --- NEW: ERROR MESSAGE DISPLAY --- */}
                {dateError && (
                  <motion.div
                    className="text-red-600 font-medium text-sm p-3 bg-red-100 rounded-lg text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {dateError}
                  </motion.div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <textarea 
                    name="jobDescription" 
                    placeholder="Describe the job role and responsibilities..." 
                    rows="3" 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 resize-vertical"
                  ></textarea>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</label>
                  <textarea 
                    name="eligibilityCriteria" 
                    placeholder="e.g., No active backlogs, specific branch requirements..." 
                    rows="2" 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 resize-vertical"
                  ></textarea>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <motion.button 
                    type="submit" 
                    className="py-2 px-6 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? 'Adding Drive...' : 'Add Drive'}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddDriveModal;

