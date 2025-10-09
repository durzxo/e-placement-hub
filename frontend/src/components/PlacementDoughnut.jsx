import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Accept chartData as a prop
const PlacementDoughnut = ({ chartData }) => { 
  if (!chartData || !chartData.labels || !chartData.data) {
    return <div className="text-gray-500 p-6">No placement data available.</div>;
  }
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        backgroundColor: ['#10B981', '#EF4444', '#3B82F6'],
        hoverBackgroundColor: ['#059669', '#DC2626', '#2563EB'],
        borderWidth: 0,
      },
    ],
  };
  const options = { /* ... your options ... */ };
  return (
    <div className="card-container">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PlacementDoughnut;