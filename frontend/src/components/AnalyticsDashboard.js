'use client';

import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = sessionStorage.getItem('token');

        const res = await fetch('http://localhost:3001/api/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.msg || 'Failed to fetch analytics');
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) return <div className="text-center p-8">Loading analytics...</div>;
  if (error) return <div className="p-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">Error: {error}</div>;
  if (!stats) return <div className="text-center p-8">No analytics data available.</div>;

  const categoryChartData = {
    labels: stats.submissionsByCategory.map(c => c.name),
    datasets: [{
      label: 'Submissions per Category',
      data: stats.submissionsByCategory.map(c => c.submissionCount),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const flaggedChartData = {
    labels: ['Flagged', 'Not Flagged'],
    datasets: [{
      data: [stats.flaggedSubmissions, stats.totalSubmissions - stats.flaggedSubmissions],
      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
      borderWidth: 1,
    }],
  };

  const timeSeriesChartData = {
    labels: stats.submissionsOverTime.map(s => s.date),
    datasets: [{
      label: 'Submissions Over Time',
      data: stats.submissionsOverTime.map(s => s.count),
      fill: false,
      borderColor: 'rgba(255, 159, 64, 1)',
      tension: 0.1,
    }],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Submissions by Category</h2>
        <Bar data={categoryChartData} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Flagged Submissions</h2>
        <Doughnut data={flaggedChartData} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow col-span-1 lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Submissions Trend</h2>
        <Line data={timeSeriesChartData} />
      </div>
    </div>
  );
}
