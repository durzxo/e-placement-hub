// frontend/src/pages/DrivesListPage.jsx (FINAL VERSION - Showing Applicant Count)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import AddDriveModal from '../components/AddDriveModal';
import { Briefcase, PlusCircle, Users, Trash2, AlertCircle } from 'lucide-react';

// Helper function to map status to Tailwind classes for the dot and pill
const getStatusClasses = (status) => {
    let dotColor = 'bg-gray-400';
    let pillColor = 'bg-gray-100 text-gray-800';

    switch (status) {
        case 'Upcoming':
            dotColor = 'bg-blue-500';
            pillColor = 'bg-blue-100 text-blue-800';
            break;
        case 'Active':
            dotColor = 'bg-yellow-500';
            pillColor = 'bg-yellow-100 text-yellow-800';
            break;
        case 'Closed':
            dotColor = 'bg-red-500';
            pillColor = 'bg-red-100 text-red-800';
            break;
        case 'Completed':
            dotColor = 'bg-green-500';
            pillColor = 'bg-green-100 text-green-800';
            break;
        default:
            // Default grey is already set
    }
    return { dotColor, pillColor };
};

const DrivesListPage = () => {
    const [drives, setDrives] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (driveId, companyName, e) => {
        e.preventDefault(); // Prevent the Link click
        e.stopPropagation(); // Prevent event bubbling

        if (window.confirm(`Are you sure you want to delete the drive for ${companyName}? This action cannot be undone.`)) {
            setIsDeleting(true);
            try {
                const response = await axios.delete(`/api/drives/${driveId}`);
                alert(response.data.message); // Show success message
                fetchDrives(); // Refresh the list
            } catch (error) {
                console.error('Failed to delete drive:', error);
                const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to delete drive';
                alert(errorMessage);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const fetchDrives = async () => {
        try {
            // This is the call now returning applicantCount
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
            className="p-4 sm:p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen"
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
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <Briefcase className="w-8 h-8 mr-3 text-teal-600" />
                        Placement Drives
                    </h1>
                    <motion.button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-teal-600 text-white py-2 px-5 rounded-lg shadow-sm font-semibold hover:bg-teal-700 hover:shadow-lg transition-all duration-200 inline-flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
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
                        drives.map(drive => {
                            const { dotColor, pillColor } = getStatusClasses(drive.status);
                            
                            return (
                                <motion.div
                                    key={drive._id}
                                    variants={cardVariants}
                                    whileHover={{ 
                                        scale: 1.03,
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="relative" // Added for absolute positioning of delete button
                                >
                                    <Link to={`/drives/details/${drive._id}`}>
                                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 hover:border-teal-500 transition-all duration-300 h-full flex flex-col justify-between">
                                            
                                            {/* Top Section */}
                                            <div>
                                                <motion.h2 
                                                    className="text-xl font-bold text-gray-900 mb-1"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    {drive.companyName}
                                                </motion.h2>
                                                <motion.p 
                                                    className="text-teal-700 font-semibold text-sm sm:text-base mb-3"
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
                                            </div>

                                            {/* Bottom Section: Status Right, Count Left */}
                                            <div className="flex justify-between items-end pt-3 border-t border-gray-100 mt-auto">
                                                
                                                {/* Applicant Count (New Info - Left) */}
                                                <div className="flex items-center text-sm font-medium text-gray-600">
                                                    <Users className="w-4 h-4 mr-1 text-gray-400" />
                                                    <span className="font-semibold text-gray-900">{drive.applicantCount || 0}</span> Applicants
                                                </div>
                                                
                                                {/* Status Pill (Right) */}
                                                <motion.span 
                                                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${pillColor}`}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                                >
                                                    {/* --- COLORED DOT --- */}
                                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${dotColor}`}></span>
                                                    {/* ------------------- */}
                                                    {drive.status}
                                                </motion.span>
                                            </div>

                                            {/* Delete Button */}
                                            <motion.button
                                                onClick={(e) => handleDelete(drive._id, drive.companyName, e)}
                                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div 
                            className="col-span-full flex flex-col items-center justify-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-gray-400 mb-4">
                                <Briefcase className="w-16 h-16" />
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