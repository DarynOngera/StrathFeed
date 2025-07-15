'use client';

import { useState, useEffect } from 'react';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // { id, name }

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError('Could not load categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to create category');
      }
      setNewCategoryName('');
      fetchCategories(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await fetch(`http://localhost:3001/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategory.name }),
      });
      if (!res.ok) throw new Error('Failed to update category');
      setEditingCategory(null);
      fetchCategories(); // Refresh list
    } catch (err) {
      setError('Failed to update category.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
        try {
            const res = await fetch(`http://localhost:3001/api/categories/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.msg || 'Failed to delete category');
            }
            fetchCategories(); // Refresh list
        } catch (err) {
            setError(err.message);
        }
    }
  };

  if (isLoading) return <p>Loading categories...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Manage Categories</h2>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
      
      {/* Create Form */}
      <form onSubmit={handleCreate} className="p-4 bg-white rounded-lg shadow space-y-3">
        <h3 className="text-lg font-medium">Add New Category</h3>
        <div className="flex gap-4">
            <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-grow p-2 border rounded-md"
            required
            />
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Add</button>
        </div>
      </form>

      {/* Edit Form (Modal-like) */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <form onSubmit={handleUpdate} className="p-6 bg-white rounded-lg shadow-xl space-y-4">
                <h3 className="text-lg font-medium">Edit Category</h3>
                <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
                />
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => setEditingCategory(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Save</button>
                </div>
            </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(cat => (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{cat.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{cat.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                  <button onClick={() => setEditingCategory({ id: cat.id, name: cat.name })} className="text-blue-600 hover:text-blue-900">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
