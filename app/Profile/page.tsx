"use client";
import React, { useState } from 'react';
import { 
  User, Settings, CreditCard, History, LogOut, 
  ShieldCheck, TrendingUp, Menu, X, Camera, 
  MapPin, Calendar, CheckCircle2, Bell,
  Home,
  ArrowLeft
} from 'lucide-react';
import Navbar from '../components/Header/page';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router=useRouter()
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');


  const gotohome=()=>{
    router.push('/')
  }

  const user = {
    name: "Juma Hamisi",
    username: "@juma_fx",
    email: "juma.forex@example.com",
    plan: "Pro Member",
    location: "Dar es Salaam, TZ",
    joined: "February 2026",
    bio: "Focused on Price Action and Gold (XAUUSD). Trading the Tanzanian session daily.",
  };

  const menuItems = [
    { id: 'Profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'Signals', label: 'My Signals', icon: <TrendingUp size={20} /> },
    { id: 'Billing', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'Security', label: 'Security', icon: <ShieldCheck size={20} /> },
    { id: 'Home', label: 'Home', icon: <Home size={20} /> },
  ];

  return (
    <>

    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* --- MOBILE NAV BAR --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <span className="font-bold flex text-yellow-500 tracking-tighter text-xl"><p className='text-white'>GALILEE</p> <p className='text-yellow-600'>FX</p></span>
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg">
          <Menu size={20} />
        </button>
      </div>

      {/* --- SIDEBAR (RESPONSIVE) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <span className="text-2xl flex font-black text-white tracking-tighter"><p className='text-white'>GALILEE</p> <p className='text-yellow-600'>FX</p></span>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.id 
                    ? 'bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/10' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button onClick={gotohome} className='flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-slate-400 hover:bg-slate-800 hover:text-white'>
               <ArrowLeft className='justify-center top-0  '/> 
               <a href='/' className='text-lg'>Home</a>
            </button>
          </nav>

          <div className="mt-auto border-t border-slate-800 pt-6">
            <button 
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors px-4 py-2">
              <LogOut size={18} />
              <span className="text-sm font-bold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        <div className="h-32 md:h-48 bg-linear-to-r from-yellow-600 via-yellow-500 to-orange-500 w-full" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 pb-20">
          
          {/* Profile Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-800 border-4 border-slate-900 overflow-hidden shadow-xl">
                    {/* Placeholder for Avatar */}
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-500">
                        {user.name.charAt(0)}
                    </div>
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-yellow-500 rounded-lg text-slate-950 border-2 border-slate-900 hover:scale-110 transition-transform">
                    <Camera size={16} />
                </button>
              </div>
              
              <div className="flex-1 md:mb-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-black text-white">{user.name}</h1>
                    <CheckCircle2 size={20} className="text-blue-400" />
                </div>
                <p className="text-slate-400 font-medium">{user.username}</p>
              </div>

              <div className="flex gap-2 md:mb-2">
                <button className="flex-1 md:flex-none bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all text-sm">
                  Edit Profile
                </button>
                <button className="p-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700">
                    <Bell size={20} />
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin size={16} className="text-yellow-500" />
                    {user.location}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={16} className="text-yellow-500" />
                    Joined {user.joined}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded text-[10px] font-bold uppercase tracking-tighter">
                        {user.plan}
                    </div>
                </div>
            </div>
            
            <p className="mt-6 text-slate-300 text-sm leading-relaxed max-w-2xl">
                {user.bio}
            </p>
          </div>

          {/* Dynamic Sections */}
          <div className="mt-8">
            {activeTab === 'Profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                {/* Account Details Box */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                    <h3 className="font-bold text-white mb-4">Account Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Email Address</label>
                            <div className="text-slate-200 mt-1">{user.email}</div>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Password</label>
                            <div className="text-slate-200 mt-1">••••••••••••</div>
                        </div>
                    </div>
                </div>

                {/* Trading Stats Box */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                    <h3 className="font-bold text-white mb-4">Trading Activity</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                            <div className="text-2xl font-bold text-green-400">84%</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500">Win Rate</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                            <div className="text-2xl font-bold text-white">12</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500">Active Signals</div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'Signals' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center animate-in fade-in">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="text-slate-600" />
                </div>
                <h3 className="font-bold text-xl">No Active Signals</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
                    You haven't followed any signals yet. Visit the signals dashboard to get started.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
    </>
  );
}