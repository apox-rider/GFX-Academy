"use client";
import React, { useState, useEffect } from 'react';
import { 
  User, Settings, CreditCard, History, LogOut, 
  ShieldCheck, TrendingUp, Menu, X, Camera, 
  MapPin, Calendar, CheckCircle2, Bell,
  Home, ArrowLeft, Lock, Smartphone, Eye, EyeOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PiCrosshairSimpleBold } from 'react-icons/pi';
import { useAuth } from '@/lib/hooks/useAuth';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, logout, isLoading: authLoading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);

  

  const [read, setRead]= useState(false)
  const [notification,setNotification] = useState([
    {id:1, category:'Daily', message:'Welcome to Galilee FX '}
  ])


  //Notification logic 


  const [user, setUser] = useState<{name: string; username: string; email: string; plan: string; location: string; joined: string; bio: string} | null>(null)
  const [subscription, setSubscription] = useState<{package_tier: string; end_date: string | null; status: string; id: string} | null>(null)
  const [editForm, setEditForm] = useState({ full_name: '', bio: '' })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/auth/login')
      return
    }

    if (authUser) {
      const fullName = authUser.full_name || 'User'
      setUser({
        name: fullName,
        username: `@${fullName?.toLowerCase().replace(/\s/g, '_') || 'user'}`,
        email: authUser.email,
        plan: 'Member',
        location: 'Tanzania',
        joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        bio: 'Forex trading enthusiast.',
      })
      setEditForm({ full_name: fullName, bio: 'Forex trading enthusiast.' })

      if (authUser.subscriptions) {
        const activeSub = Array.isArray(authUser.subscriptions) 
          ? authUser.subscriptions.find((s: { status: string }) => s.status === 'active')
          : authUser.subscriptions
        if (activeSub) {
          setSubscription({
            package_tier: activeSub.package_tier || 'free',
            end_date: activeSub.end_date || null,
            status: activeSub.status || 'active',
            id: activeSub.id || '',
          })
        }
      }
    }
  }, [authUser, authLoading, router])

  const gotohome = () => router.push('/');

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

 

  const handlenotifications = () => {
    setActiveTab('Notifications')
    setRead(true)
  }

  const displayUser = user || {
    name: "Loading...",
    username: "@loading",
    email: "",
    plan: "Member",
    location: "Tanzania",
    joined: "",
    bio: "",
  }

  const menuItems = [
    { id: 'Profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'Signals', label: 'My Signals', icon: <TrendingUp size={20} /> },
    { id: 'Billing', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'Security', label: 'Security', icon: <ShieldCheck size={20} /> },
    { id: 'Notifications', label: 'Notifications', icon: <Bell size={20} /> },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!authUser) {
    return null
  }

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
        <div className={`h-32 md:h-48 bg-gradient-to-r ${subscription?.package_tier==='Free'?' from-yellow-600 via-yellow-500 to-orange-500':' from-blue-600 via-blue-500 to-orange-500'} w-full`} />


            {/* I HAVE TO GET THROUGH THE PACKAGE_TIER */}



            
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 pb-20">
          
          {/* Profile Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-800 border-4 border-slate-900 overflow-hidden shadow-xl flex items-center justify-center text-4xl font-bold text-slate-500">
                    {displayUser.name.charAt(0)}
                </div>
                 
              </div>
              
              <div className="flex-1 md:mb-2">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                        className="text-2xl md:text-3xl font-black text-white bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 outline-none focus:border-yellow-500"
                      />
                    ) : (
                      <h1 className="text-2xl md:text-3xl font-black text-white">{displayUser.name}</h1>
                    )}
                    <CheckCircle2 size={20} className="text-blue-400" />
                </div>
                <p className="text-slate-400 font-medium">{displayUser.username}</p>
              </div>

              <div className="flex gap-2 md:mb-2">
                <button 
                disabled={isSaving}
                className={`flex-1 md:flex-none font-bold px-6 py-2.5 rounded-xl transition-all text-sm ${isEditing ? 'bg-green-500 text-white' : 'bg-yellow-500 text-slate-950'} disabled:opacity-50`}>
                   PROFILE
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
                    {displayUser.location}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={16} className="text-yellow-500" />
                    Joined {displayUser.joined}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded text-[10px] font-bold uppercase tracking-tighter">
                        {displayUser.plan}
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
                                <input defaultValue={displayUser.email} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg mt-1 text-sm text-yellow-500 outline-none" />
                            ) : (
                                <div className="text-slate-200 mt-1">{displayUser.email}</div>
                            )}
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Bio</label>
                            {isEditing ? (
                                <textarea defaultValue={displayUser.bio} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg mt-1 text-sm text-yellow-500 outline-none h-20" />
                            ) : (
                                <div className="text-slate-200 mt-1 text-sm">{displayUser.bio}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                    <h3 className="font-bold text-white mb-4">Trading Activity</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                            <div className="text-2xl font-bold text-white">{displayUser.plan}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500">Plan</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                            <div className="text-2xl font-bold text-yellow-500">{subscription?.package_tier || 'Free'}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500">Package</div>
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
                        <Lock size={20} className="text-yellow-500" /> UNDER UPGRADE DEVELOPMENT
                    </h3>
                    <div className="space-y-4 hidden">
                        <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
                            <div>
                                <p className="text-sm font-bold">Change Password</p>
                                <p className="text-xs text-slate-500">Update your account security regularly.</p>
                            </div>
                            <button className="text-xs bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">Update</button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
                            <button className="text-xs text-green-500">Enable</button>
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
