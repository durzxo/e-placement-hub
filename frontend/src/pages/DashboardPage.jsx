import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import UpcomingDrives from '../components/UpcomingDrives';
import PlacementDoughnut from "../components/PlacementDoughnut";
import './DashboardPage.css';
import { FaUsers, FaBuilding, FaUserCheck, FaPercentage } from 'react-icons/fa';

const DashboardPage = () => {
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
    return <div className="p-8">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Placement Dashboard</h1>
        <p>Quick insights into placement activities.</p>
      </header>

      <main>
        <div className="stats-grid">
          <StatCard icon={<FaUsers />} title="Total Students" value={stats.totalStudents} color="icon-blue" />
          <StatCard icon={<FaBuilding />} title="Active Drives" value={stats.activeDrives} color="icon-purple" />
          <StatCard icon={<FaUserCheck />} title="Total Selected" value={stats.totalSelected} color="icon-green" />
          <StatCard icon={<FaPercentage />} title="Placement Rate" value={`${stats.placementRate}%`} color="icon-orange" />
        </div>

        <div className="bottom-grid">
          <div className="doughnut-container">
            {/* Pass the chart data as a prop */}
            <PlacementDoughnut chartData={stats.placementStatusData} />
          </div>
          <div className="upcoming-drives-container">
            {/* Pass the upcoming drives data as a prop */}
            <UpcomingDrives drives={stats.upcomingDrives} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;