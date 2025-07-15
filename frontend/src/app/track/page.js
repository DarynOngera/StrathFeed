'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';



export default function TrackFeedbackPage() {
  const searchParams = useSearchParams();
  const [trackingCode, setTrackingCode] = useState(searchParams.get('code') || '');
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!trackingCode.trim()) {
      setError('Please enter a tracking code.');
      return;
    }
    setIsLoading(true);
    setError('');
    setFeedbackStatus(null);

    try {
      const res = await fetch(`http://localhost:3001/api/feedback/${trackingCode}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Could not find feedback with that code.');
      }

      setFeedbackStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (trackingCode) {
      handleTrackSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Track Your Feedback</h1>
          <p className="mt-2 text-gray-600">Enter the code you received upon submission.</p>
        </div>

        <form onSubmit={(e) => handleTrackSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="trackingCode" className="sr-only">Tracking Code</label>
            <input
              id="trackingCode"
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your tracking code"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Searching...' : 'Check Status'}
          </button>
        </form>

        {error && (
          <div className="p-3 text-red-800 bg-red-100 border border-red-200 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {feedbackStatus && (
          <div className="p-4 space-y-2 border-t border-gray-200">
            <h2 className="text-lg font-semibold">Submission Status</h2>
            <p><strong>Submitted On:</strong> {new Date(feedbackStatus.created_at).toLocaleString()}</p>
            <p><strong>Status:</strong> {feedbackStatus.flagged ? <span className='font-semibold text-yellow-600'>Flagged for Review</span> : <span className='font-semibold text-green-600'>Received</span>}</p>
            <div className="mt-4 text-center">
              <Link href="/submit" className="text-sm font-medium text-blue-600 hover:underline">
                Submit another piece of feedback
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
