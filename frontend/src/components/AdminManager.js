'use client';

import { useState, useEffect } from 'react';

export default function AdminManager() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', role: 'Department' });

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/auth/admins', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch admins');
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      setError('Could not load admin accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to create admin');
      }
      setNewAdmin({ username: '', password: '', role: 'Department' });
      fetchAdmins(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin account?')) {
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`http://localhost:3001/api/auth/admins/${id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (!res.ok) throw new Error('Failed to delete admin');
            fetchAdmins(); // Refresh list
        } catch (err) {
            setError('Failed to delete admin.');
        }
    }
  };

  if (isLoading) return <p>Loading admin accounts...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Manage Admin Accounts</h2>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
      
      {/* Create Admin Form */}
      <form onSubmit={handleCreate} className="p-4 bg-white rounded-lg shadow space-y-3">
        <h3 className="text-lg font-medium">Add New Admin</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
                name="username"
                type="text"
                value={newAdmin.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="p-2 border rounded-md"
                required
            />
            <input
                name="password"
                type="password"
                value={newAdmin.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="p-2 border rounded-md"
                required
            />
            <select name="role" value={newAdmin.role} onChange={handleInputChange} className="p-2 border rounded-md">
                <option value="Department">Department</option>
                <option value="Super">Super</option>
            </select>
        </div>
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full md:w-auto">Add Admin</button>
      </form>

      {/* Admins Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{admin.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{admin.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{admin.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
