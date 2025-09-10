import React from 'react';
import { BsCalendarEvent } from 'react-icons/bs';
import { motion } from 'framer-motion';

// The component already accepts drives as a prop, but we'll format the date
const UpcomingDrives = ({ drives }) => {
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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="card-title">Upcoming Drives</h3>
      <motion.ul 
        className="drives-list"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {drives && drives.length > 0 ? (
          drives.map((drive, index) => (
            <motion.li 
              key={drive._id || index} 
              className="drives-list-item"
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BsCalendarEvent className="drives-list-item-icon flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="drive-company truncate">{drive.companyName}</p>
                <p className="drive-date">
                  {new Date(drive.driveDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </motion.li>
          ))
        ) : (
          <motion.div 
            className="text-center py-6 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <BsCalendarEvent className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No upcoming drives</p>
          </motion.div>
        )}
      </motion.ul>
    </motion.div>
  );
};

export default UpcomingDrives;