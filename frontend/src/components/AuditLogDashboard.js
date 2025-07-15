'use client';

import { useState, useEffect } from 'react';

export default function AuditLogDashboard() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ adminId: '', actionType: '', startDate: '', endDate: '' });
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:3001/api/audit?${query}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch audit logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError('Could not load logs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const res = await fetch('http://localhost:3001/api/auth/admins', {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch admins');
        const data = await res.json();
        setAdmins(data);
    } catch (err) {
        console.error('Failed to load admin list:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchAdmins();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  if (isLoading) return <p>Loading audit logs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Audit Log</h2>
      <form onSubmit={handleFilterSubmit} className="p-4 bg-gray-50 rounded-lg space-y-4 md:flex md:space-y-0 md:space-x-4">
        <select name="adminId" value={filters.adminId} onChange={handleFilterChange} className="p-2 border rounded-md w-full">
          <option value="">All Admins</option>
          {admins.map(admin => <option key={admin.id} value={admin.id}>{admin.username}</option>)}
        </select>
        <input type="text" name="actionType" value={filters.actionType} onChange={handleFilterChange} placeholder="Action Type (e.g., STATUS_UPDATED)" className="p-2 border rounded-md w-full" />
        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="p-2 border rounded-md w-full" />
        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="p-2 border rounded-md w-full" />
        <button type="submit" className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Filter</button>
      </form>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map(log => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{log.admin_username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono bg-gray-100">{log.action_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{log.target_type && `${log.target_type} #${log.target_id}`}</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600">{log.details}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
