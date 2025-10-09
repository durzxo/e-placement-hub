import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Bell, Calendar, User, Clock, Trash2 } from 'lucide-react';
import axios from 'axios';
import AddNoticeModal from '../components/AddNoticeModal';

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'student';

  const handleDelete = async (noticeId, title, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm(`Are you sure you want to delete the notice "${title}"? This action cannot be undone.`)) {
      setIsDeleting(true);
      try {
        const response = await axios.delete(`/api/notices/${noticeId}`);
        alert(response.data.message);
        fetchNotices(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete notice:', error);
        const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to delete notice';
        alert(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/notices');
      setNotices(response.data);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAddNotice = async (noticeData) => {
    try {
      await axios.post('/api/notices', noticeData);
      fetchNotices(); // Refresh the notices list
    } catch (error) {
      console.error('Failed to add notice:', error);
      alert('Failed to add notice. Please try again.');
    }
  };

  // If no notices exist yet, use these as initial data
  useEffect(() => {
    const initializeNotices = async () => {
      try {
        const response = await axios.get('/api/notices');
        if (response.data.length === 0) {
          // Only add mock notices if no notices exist in the database
          const mockNotices = [
            {
              title: "New Placement Drive - TCS Digital",
              content: "TCS is conducting a placement drive for Software Engineer positions. Eligible students with CGPA above 7.5 can apply. Registration deadline: October 15, 2025.",
              date: "2025-10-05",
              time: "10:30 AM",
              author: "Placement Cell",
              priority: "high",
              category: "placement"
            },
            {
              title: "Resume Building Workshop",
              content: "Join us for a comprehensive resume building workshop to enhance your job application. Professional tips and one-on-one guidance will be provided.",
              date: "2025-10-08",
              time: "2:00 PM",
              author: "Training Department",
              priority: "medium",
              category: "workshop"
            },
            {
              title: "Mock Interview Sessions",
              content: "Mock interview sessions will be conducted for final year students. Book your slot through the placement portal. Limited seats available.",
              date: "2025-10-10",
              time: "9:00 AM",
              author: "Placement Team",
              priority: "medium",
              category: "interview"
            },
            {
              title: "Important: Document Verification",
              content: "All students must complete document verification before October 20, 2025. Please bring original certificates and mark sheets.",
              date: "2025-10-06",
              time: "11:00 AM",
              author: "Admin Office",
              priority: "high",
              category: "important"
            },
            {
              title: "Industry Expert Session - AI/ML Trends",
              content: "Special session on latest AI/ML industry trends and career opportunities. Guest speaker from Google will share insights.",
              date: "2025-10-12",
              time: "3:30 PM",
              author: "COMPUTER DEPARTMENT",
              priority: "low",
              category: "session"
            }
          ];

          // Add mock notices to database
          for (const notice of mockNotices) {
            await axios.post('/api/notices', notice);
          }
          fetchNotices(); // Refresh the notices list after adding mock data
        }
      } catch (error) {
        console.error('Error initializing notices:', error);
      }
    };

    initializeNotices();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'placement': return '💼';
      case 'workshop': return '🎓';
      case 'interview': return '🗣️';
      case 'important': return '⚠️';
      case 'session': return '👨‍🏫';
      default: return '📋';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center mb-2">
          <Bell className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Notices & Announcements</h1>
        </div>
        <p className="text-gray-600">
          {userRole === 'student' 
            ? 'Stay updated with latest placement drives and important announcements' 
            : 'Manage and view all notices for students'}
        </p>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {notices.map((notice) => (
          <motion.div
            key={notice._id}
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 relative"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getCategoryIcon(notice.category)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 pr-8">
                      {notice.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {notice.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {notice.time}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {notice.author}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                    {notice.priority.toUpperCase()}
                  </span>
                  {userRole === 'admin' && (
                    <motion.button
                      onClick={(e) => handleDelete(notice._id, notice.title, e)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {notice.content}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {userRole === 'admin' && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200 font-semibold"
          >
            + Add New Notice
          </button>
        </motion.div>
      )}

      <AddNoticeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNotice}
      />
    </motion.div>
  );
};

export default NoticesPage;