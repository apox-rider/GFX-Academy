'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { RiSecurePaymentFill } from 'react-icons/ri';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: 'dashboard' | 'signals' | 'courses' | 'contacts' | 'settings' | 'payments' | 'videos' | 'links') => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'signals', label: 'Trading Signals', icon: TrendingUp },
      { id: 'courses', label: 'Courses', icon: BookOpen },
      { id: 'contacts', label: 'Contacts', icon: MessageSquare },
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'payments', label: 'Payments', icon: RiSecurePaymentFill },
      { id: 'videos', label: 'Videos', icon: '🎥' },
      { id: 'links', label: 'Links', icon: '🔗' }
    ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className=" lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-xl border border-gray-700"
      >
        {isMobileOpen ? <X size={24} /> : <Menu className='' size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800 
        transform transition-transform duration-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-black font-bold text-2xl">
              M
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">GFXAdmin</h1>
              <p className="text-xs text-gray-500">Pro Trader Panel</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold' 
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-lg">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-8 left-6 right-6">
          <button
            onClick={() => {
              localStorage.removeItem('adminAuth');
              window.location.reload();
            }}
            className="w-full flex items-center justify-center gap-3 bg-red-950 hover:bg-red-900 text-red-400 py-3 rounded-2xl transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}