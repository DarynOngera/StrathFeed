'use client';

export default function AdminNav({ userRole, activeTab, setActiveTab, handleLogout }) {
  const navItems = [
    { id: 'feedback', label: 'Feedback Dashboard' },
    // Conditionally add tabs for Super Admins
    ...(userRole === 'Super' ? [{ id: 'analytics', label: 'Analytics' }] : []),
    ...(userRole === 'Super' ? [{ id: 'categories', label: 'Manage Categories' }] : []),
    ...(userRole === 'Super' ? [{ id: 'admins', label: 'Manage Admins' }] : []),
    ...(userRole === 'Super' ? [{ id: 'auditLog', label: 'Audit Log' }] : []),
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl text-gray-800">StrathFeed</span>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
