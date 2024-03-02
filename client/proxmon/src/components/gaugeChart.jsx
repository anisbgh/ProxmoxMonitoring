import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ value, label }) => {
  // Function to determine color based on value
  const getColor = (value) => {
    if (value < 50) return '#00ff00'; // Green
    if (value < 80) return '#ffff00'; // Yellow
    return '#ff0000'; // Red
  };

  const data = {
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [getColor(value), '#ddd'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div>
      <Doughnut data={data} options={options} />
      <div style={{ textAlign: 'center' }}>{label}: {value.toFixed(2)}%</div>
    </div>
  );
};

export default GaugeChart;
