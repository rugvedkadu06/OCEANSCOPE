// src/components/PieChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }) {
  if (!data || !Array.isArray(data)) return <div className="h-full flex items-center justify-center text-slate-600 italic">No segment data.</div>;

  const chartData = {
    labels: data.map((d) => d.name || d.label || "Unknown"),
    datasets: [
      {
        data: data.map((d) => d.value || 0),
        backgroundColor: [
          "#00d2ff", // Primary (Above)
          "rgba(255, 255, 255, 0.05)", // Ghost (Below)
          "#a5e7ff", 
          "#d0bcff",
        ],
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 2,
        hoverOffset: 20
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "right", 
        labels: { 
          color: "#94a3b8",
          font: { family: "Inter", weight: "bold", size: 10 },
          padding: 20,
          usePointStyle: true
        } 
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 12,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1
      }
    },
    cutout: "75%",
  };

  return (
    <div className="w-full h-full p-2">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
