'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SubmitPage() {
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (err) {
        setError('Could not load categories. Please try again later.');
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !categoryId) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, category_id: categoryId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'An unknown error occurred.');
      }
      
      setMessage(`Your feedback has been submitted! Your tracking code is: ${data.trackingCode}.`);
      setContent('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setCopySuccess(''); // Reset copy success message on new submission
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Submit Feedback Anonymously</h1>
          <p className="mt-2 text-gray-600">Your voice matters. Share your concerns without revealing your identity.</p>
          <p className="mt-4 text-sm">
            Already submitted?{' '}
            <Link href="/track" className="font-medium text-blue-600 hover:underline">
              Track your feedback here
            </Link>
          </p>
        </div>

        {message && (
          <div className="p-4 text-center text-green-800 bg-green-100 border border-green-200 rounded-lg">
            <p className="font-semibold">Success!</p>
            <p>Your feedback has been submitted. Please save your tracking code:</p>
            <div className="flex items-center justify-center gap-2 mt-2 bg-green-200 p-2 rounded-md">
              <strong className="font-mono text-green-900">{message.split(' ').pop().slice(0, -1)}</strong>
              <button
                onClick={() => {
                  const code = message.split(' ').pop().slice(0, -1);
                  navigator.clipboard.writeText(code);
                  setCopySuccess('Copied!');
                  setTimeout(() => setCopySuccess(''), 2000);
                }}
                className="p-1 text-green-900 rounded-full hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              {copySuccess && <span className="text-sm text-green-900">{copySuccess}</span>}
            </div>
            <Link
              href={`/track?code=${message.split(' ').pop().slice(0, -1)}`}
              className="mt-4 inline-block font-bold text-green-900 underline hover:text-green-700"
            >
              Track its status now
            </Link>
          </div>
        )}

        {error && (
          <div className="p-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Your Feedback</label>
              <textarea
                id="content"
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please be detailed and specific..."
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Submitting...' : 'Submit Anonymously'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
