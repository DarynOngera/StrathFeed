'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <div className="w-full max-w-3xl p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to StrathFeed</h1>
        <p className="mt-4 text-lg text-gray-600">
          A safe and anonymous space for students to share their concerns and contribute to a better campus environment.
        </p>
        <div className="pt-6 space-y-4 md:space-y-0 md:flex md:gap-4 md:justify-center">
          <Link href="/submit" className="block w-full md:w-auto px-8 py-3 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Give Feedback Now
          </Link>
          <Link href="/track" className="block w-full md:w-auto px-8 py-3 font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
              Track Your Feedback
          </Link>
          <Link href="/admin/login" className="block w-full md:w-auto px-8 py-3 font-semibold text-blue-600 bg-white border border-blue-600 rounded-md shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Administrator Login
          </Link>
        </div>
      </div>
      <footer className="mt-8 text-sm text-gray-500">
        <p>Your privacy is our priority. All submissions are 100% anonymous.</p>
      </footer>
    </main>
  );
}

