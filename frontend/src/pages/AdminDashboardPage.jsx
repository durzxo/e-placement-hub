import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import UpcomingDrives from '../components/UpcomingDrives';
import PlacementDoughnut from "../components/PlacementDoughnut";
import './DashboardPage.css';
import { FaUsers, FaBuilding, FaUserCheck, FaPercentage } from 'react-icons/fa';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <motion.div 
        className="flex items-center justify-center h-screen"
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
          Loading Admin Dashboard...
        </motion.p>
      </motion.div>
    );
  }

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
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="dashboard-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1>Admin Dashboard</h1>
        <p>Quick insights and management tools for placement activities.</p>
      </motion.header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="stats-grid"
          variants={itemVariants}
        >
          <StatCard icon={<FaUsers />} title="Total Students" value={stats.totalStudents} color="icon-blue" />
          <StatCard icon={<FaBuilding />} title="Active Drives" value={stats.activeDrives} color="icon-purple" />
          <StatCard icon={<FaUserCheck />} title="Total Selected" value={stats.totalSelected} color="icon-green" />
          <StatCard icon={<FaPercentage />} title="Placement Rate" value={`${stats.placementRate}%`} color="icon-orange" />
        </motion.div>

        <motion.div 
          className="bottom-grid"
          variants={itemVariants}
        >
          <motion.div 
            className="doughnut-container"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <PlacementDoughnut />
          </motion.div>
          <UpcomingDrives />
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default AdminDashboardPage;
