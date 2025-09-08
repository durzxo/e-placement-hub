// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ icon, title, value, color }) => {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${color}`}>
        {icon}
      </div>
      <div>
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;