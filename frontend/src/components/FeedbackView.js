'use client';

import { useState, useEffect } from 'react';

export default function FeedbackView() {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const [feedbackRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:3001/api/feedback', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('http://localhost:3001/api/categories'),
      ]);

      if (!feedbackRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const feedbackData = await feedbackRes.json();
      const categoriesData = await categoriesRes.json();

      setFeedback(feedbackData);
      setFilteredFeedback(feedbackData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Could not load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredFeedback(feedback);
    } else {
      setFilteredFeedback(feedback.filter(item => item.category_name === selectedCategory));
    }
  }, [selectedCategory, feedback]);

  const handleFlag = async (id) => {
    try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(`http://localhost:3001/api/feedback/flag/${id}`, { 
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to flag feedback');
        fetchData(); // Refresh data to show the change
    } catch (err) {
        setError('Failed to update flag status.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(`http://localhost:3001/api/feedback/status/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error('Failed to update status');
        // Optimistically update the UI or refetch
        setFeedback(prevFeedback => 
            prevFeedback.map(item => item.id === id ? { ...item, status: newStatus } : item)
        );
    } catch (err) {
        setError('Failed to update status.');
    }
  };

  if (isLoading) return <p>Loading feedback...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Feedback Submissions</h2>
            <select 
                onChange={(e) => setSelectedCategory(e.target.value)} 
                className="p-2 border rounded-md"
            >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
            </select>
        </div>
        <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFeedback.map(item => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{item.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{item.category_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(item.created_at).toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 break-words max-w-md">{item.content}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <select 
                                    value={item.status}
                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                    className="p-1 border rounded-md bg-white"
                                >
                                    <option value="New">New</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button onClick={() => handleFlag(item.id)} className={`mr-2 ${item.flagged ? 'text-red-600 hover:text-red-900' : 'text-blue-600 hover:text-blue-900'}`}>
                                    {item.flagged ? 'Unflag' : 'Flag'}
                                </button>
                                {item.flagged && <span className='text-red-500 font-semibold'>Flagged</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}
