// src/components/PlacementDoughnut.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { placementStatusData } from '../data/dashboardData';

ChartJS.register(ArcElement, Tooltip, Legend);

const PlacementDoughnut = () => {
  const data = {
    labels: placementStatusData.labels,
    datasets: [
      {
        data: placementStatusData.data,
        backgroundColor: [
          '#10B981', // Green for 'Selected'
          '#EF4444', // Red for 'Not Selected'
          '#3B82F6', // Blue for 'In Progress'
        ],
        hoverBackgroundColor: [
          '#059669',
          '#DC2626',
          '#2563EB',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll use our custom HTML legend
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed;
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="card-container">
      <h3 className="card-title">Overall Placement Status</h3>
      <div className="doughnut-chart-wrapper">
        <div className="doughnut-chart">
          <Doughnut data={data} options={options} />
        </div>
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color-box" style={{ backgroundColor: '#10B981' }}></span>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box" style={{ backgroundColor: '#EF4444' }}></span>
            <span>Not Selected</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-box" style={{ backgroundColor: '#3B82F6' }}></span>
            <span>In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDoughnut;