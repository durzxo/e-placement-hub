// src/components/StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, title, value, color }) => {
  return (
    <motion.div 
      className="stat-card"
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`stat-card-icon ${color}`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        {icon}
      </motion.div>
      <div>
        <p className="stat-card-title">{title}</p>
        <motion.p 
          className="stat-card-value"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default StatCard;