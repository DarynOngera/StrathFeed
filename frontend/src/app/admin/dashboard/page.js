'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import FeedbackView from '@/components/FeedbackView';
import CategoryManager from '@/components/CategoryManager';
import AdminManager from '@/components/AdminManager';
import AuditLogDashboard from '@/components/AuditLogDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('feedback');
  const router = useRouter();

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn || !role) {
      router.push('/admin/login');
    } else {
      setUserRole(role);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');
    router.push('/');
  };

  if (!userRole) {
    // Render a loading state or null while checking auth
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav userRole={userRole} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            {activeTab === 'feedback' && <FeedbackView />}
            {userRole === 'Super' && activeTab === 'analytics' && <AnalyticsDashboard />}
            {userRole === 'Super' && activeTab === 'categories' && <CategoryManager />}
            {userRole === 'Super' && activeTab === 'admins' && <AdminManager />}
            {userRole === 'Super' && activeTab === 'auditLog' && <AuditLogDashboard />}
        </div>
      </main>
    </div>
  );
}
