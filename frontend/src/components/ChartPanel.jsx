// src/components/ChartPanel.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartPanel({ data, predictions }) {
  const chartData = {
    labels: [...data.map((d) => d.year), ...predictions.map((p) => p.year)],
    datasets: [
      {
        label: "Historical Avg (°C)",
        data: data.map((d) => d.temperature),
        borderColor: "#a5e7ff",
        backgroundColor: "rgba(165, 231, 255, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Gemini AI Forecast (°C)",
        data: [...Array(data.length).fill(null), ...predictions.map((p) => p.temperature)],
        borderColor: "#f87171",
        borderDash: [5, 5],
        backgroundColor: "transparent",
        tension: 0,
        pointStyle: 'circle',
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#859399" } },
    },
    scales: {
      y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#859399" } },
      x: { grid: { display: false }, ticks: { color: "#859399" } },
    },
  };

  return (
    <div className="w-full h-full p-2">
      <Line data={chartData} options={options} />
    </div>
  );
}
