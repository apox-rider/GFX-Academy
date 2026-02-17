"use client";
import React, { useState } from 'react';
import { 
  User, Settings, CreditCard, History, LogOut, 
  ShieldCheck, TrendingUp, Menu, X, Camera, 
  MapPin, Calendar, CheckCircle2, Bell,
  Home, ArrowLeft, Lock, Smartphone, Eye, EyeOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PiCrosshairSimpleBold } from 'react-icons/pi';

export default function ProfilePage() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [read, setRead]= useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setIsNotification] = useState([
    {id:1, category:'Daily', message:'Welcome to Galilee TX '}
  ])
  //  if(activeTab==='Notifications'){
  //   setRead(!read)
  // };


  // --- HANDLER FUNCTIONS ---
  const gotohome = () => router.push('/');

 

  const handleLogout = () => {
    // Add your logic to clear cookies/localstorage here
    console.log("Logging out...");
    router.push('/auth/login');
  };

  const editprofile = () => {
    setIsEditing(!isEditing);
    if(isEditing) {
        // profile editing
        console.log("Saving profile changes...");
    }
  };

  const handlenotifications = () => {
    console.log("Opening notifications...");
    setRead(true)
    setActiveTab('Notifications')
  };

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
    { id: 'Notifications', label: 'Notifications', icon: <Bell size={20} /> },
  ];

  return (
    <>
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* --- MOBILE NAV BAR --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <span className="font-bold flex text-yellow-500 tracking-tighter text-xl">
            <p className='text-white'>GALILEE</p> <p className='text-yellow-600'>FX</p>
        </span>
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg">
          <Menu size={20} />
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <span className="text-2xl flex font-black text-white tracking-tighter">
                <p className='text-white'>GALILEE</p> <p className='text-yellow-600'>FX</p>
            </span>
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
               <ArrowLeft size={20}/> 
               <span className='text-md'>Back Home</span>
            </button>
          </nav>

          <div className="mt-auto border-t border-slate-800 pt-6">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors px-4 py-2 w-full"
            >
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
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-800 border-4 border-slate-900 overflow-hidden shadow-xl flex items-center justify-center text-4xl font-bold text-slate-500">
                    {user.name.charAt(0)}
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
                <button 
                onClick={editprofile}
                className={`flex-1 md:flex-none font-bold px-6 py-2.5 rounded-xl transition-all text-sm ${isEditing ? 'bg-green-500 text-white' : 'bg-yellow-500 text-slate-950'}`}>
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
                <button 
                onClick={handlenotifications}
                className="p-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 relative">
                    <Bell size={20} />
                    <span className={`absolute top-2 right-2 w-2 h-2 ${read?'':'bg-red-500'} rounded-full border border-slate-800`}></span>
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
          </div>

          {/* --- DYNAMIC SECTIONS --- */}
          <div className="mt-8">
            {/* PROFILE TAB */}
            {activeTab === 'Profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                    <h3 className="font-bold text-white mb-4">Account Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Email Address</label>
                            {isEditing ? (
                                <input defaultValue={user.email} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg mt-1 text-sm text-yellow-500 outline-none" />
                            ) : (
                                <div className="text-slate-200 mt-1">{user.email}</div>
                            )}
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Bio</label>
                            {isEditing ? (
                                <textarea defaultValue={user.bio} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg mt-1 text-sm text-yellow-500 outline-none h-20" />
                            ) : (
                                <div className="text-slate-200 mt-1 text-sm">{user.bio}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                    <h3 className="font-bold text-white mb-4">Trading Activity</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                            <div className="text-2xl font-bold text-white">12</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500">Active Signals</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                            <div className="text-2xl font-bold text-yellow-500">Gold</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500">Pref. Pair</div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'Security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <Lock size={20} className="text-yellow-500" /> Login & Password
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
                            <div>
                                <p className="text-sm font-bold">Change Password</p>
                                <p className="text-xs text-slate-500">Update your account security regularly.</p>
                            </div>
                            <button className="text-xs bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">Update</button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
                            <div>
                                <p className="text-sm font-bold">Two-Factor Authentication</p>
                                <p className="text-xs text-green-500">Active (via SMS)</p>
                            </div>
                            <button className="text-xs text-red-500">Disable</button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Smartphone size={20} className="text-yellow-500" /> Login Devices
                    </h3>
                    <div className="text-sm text-slate-400 space-y-3">
                        <div className="flex items-center justify-between">
                            <span>iPhone 15 Pro • Dar es Salaam</span>
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Current</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                            <span>Windows Desktop • Mbeya</span>
                            <button className="text-red-500 text-xs">Revoke</button>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* SIGNALS TAB (Placeholder) */}
            {activeTab === 'Signals' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center animate-in fade-in">
                <TrendingUp size={48} className="text-slate-800 mx-auto mb-4" />
                <h3 className="font-bold text-xl">No Recent Alerts</h3>
                <p className="text-slate-400 text-sm mt-2">Active signals will appear here for Pro Members.</p>
              </div>
            )}

            {activeTab==='Notifications'&&(
              <>
              {notification.length>0?(
                <>
                <div>
                  {notification.map((n)=>(
                    <div
                    key={n.id}
                    className='font-bold text-xl'>
                    <h2 className='flex text-xl'><p className='text-white'>Category:</p><p className='text-yellow-200'>{n.category}</p></h2>
                    <p className='text-slate-400 text-sm mt-2'>{n.message}</p>
                    </div>
                  ))}
                </div>
                </>
              ):(
                <>
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center animate-in fade-in">
                  <PiCrosshairSimpleBold size={48} className="text-slate-800 mx-auto mb-4" />
                   <h3 className="font-bold text-xl">No Notifications Available</h3>
                   <p className="text-slate-400 text-sm mt-2">All Notifications will appear here </p>
                  </div>
                </>
              )}
              </>
             )}
          </div>
        </div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
    </>
  );
}