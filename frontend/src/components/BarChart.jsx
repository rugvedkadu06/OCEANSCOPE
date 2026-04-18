// src/components/BarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.year),
    datasets: [
      {
        label: "Mean Temp (°C)",
        data: data.map((d) => d.temperature),
        backgroundColor: "rgba(165, 231, 255, 0.6)",
        borderColor: "#00d2ff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: false, grid: { color: "rgba(0,0,0,0.05)" } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="w-full h-full p-4 bg-white border border-gray-100 shadow-sm">
      <Bar data={chartData} options={options} />
    </div>
  );
}
