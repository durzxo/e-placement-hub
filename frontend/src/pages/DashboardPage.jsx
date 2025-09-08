// src/pages/DashboardPage.jsx

import React from 'react';
import StatCard from '../components/StatCard';
import UpcomingDrives from '../components/UpcomingDrives';
import PlacementDoughnut from "../components/PlacementDoughnut"
import './DashboardPage.css'; // Import the stylesheet

// Import icons for the stat cards
import { FaUsers, FaBuilding, FaUserCheck, FaPercentage } from 'react-icons/fa';

const DashboardPage = () => {
  // --- SAMPLE DATA ---
  // In a real app, you would fetch this data from an API
  const totalStudents = 120;
  const activeDrives = 3;
  const totalSelected = 28;
  const placementRate = ((totalSelected / totalStudents) * 100).toFixed(1);

  const upcomingDrivesData = [
    { company: 'TCS', date: 'Sept 10, 2025' },
    { company: 'Infosys', date: 'Sept 15, 2025' },
    { company: 'Wipro', date: 'Sept 20, 2025' },
    { company: 'Accenture', date: 'Sept 25, 2025' },
  ];
  // --- END SAMPLE DATA ---

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Placement Dashboard</h1>
        <p>Quick insights into placement activities.</p>
      </header>

      <main>
        {/* Top row of statistics */}
        <div className="stats-grid">
          <StatCard icon={<FaUsers />} title="Total Students" value={totalStudents} color="icon-blue" />
          <StatCard icon={<FaBuilding />} title="Active Drives" value={activeDrives} color="icon-purple" />
          <StatCard icon={<FaUserCheck />} title="Total Selected" value={totalSelected} color="icon-green" />
          <StatCard icon={<FaPercentage />} title="Placement Rate" value={`${placementRate}%`} color="icon-orange" />
        </div>

        {/* Bottom row with chart and list */}
        <div className="bottom-grid">
          <div className="doughnut-container">
            <PlacementDoughnut />
          </div>
          <div className="upcoming-drives-container">
            <UpcomingDrives drives={upcomingDrivesData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;