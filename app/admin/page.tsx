'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar/page';
import AdminHeader from '../components/AdminHeader/page';
import DashboardContent from '../components/DashboardContent/page';
import SignalsContent from '../components/SignalsContent/page';
import CoursesContent from '../components/CoursesContent/page';
import ContactsContent from '../components/ContactsContent/page';
import SettingsContent from '../components/SettingsContent/page';
import PaymentsContent from '../components/Payment Content/page';
 

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'signals' | 'courses' | 'payments' | 'settings' | 'contacts'>('dashboard');

 
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Gladness M';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      localStorage.setItem('adminAuth', 'true');
    } else {
      setError('Incorrect password');
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-white">GFX Admin</h1>
            <p className="text-gray-400 mt-2">Enter password to access admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-5 py-4 focus:outline-none focus:border-yellow-500 transition"
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-semibold py-4 rounded-xl transition-all duration-300"
            >
              Login to Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-auto p-6 bg-gray-950">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'signals' && <SignalsContent />}
          {activeTab === 'courses' && <CoursesContent />}
          {activeTab === 'contacts' && <ContactsContent />}
          {activeTab === 'settings' && <SettingsContent />}
          {activeTab === 'payments' && <PaymentsContent />}
        </main>
      </div>
    </div>
  );
}