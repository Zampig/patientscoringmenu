import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function EngagementPieChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          '#4299E1', // blue-500
          '#48BB78', // green-500
          '#ECC94B', // yellow-500
          '#F56565', // red-500
          '#9F7AEA', // purple-500
          '#ED64A6', // pink-500
        ],
        borderWidth: 1,
        borderColor: '#FFFFFF',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} patients (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Engagement Score Distribution</h3>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
} 