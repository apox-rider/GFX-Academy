'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  TrendingUp, BookOpen, Bell, CreditCard, 
  LogOut, Menu, X, ChevronRight, Clock,
  Target, BarChart3
} from 'lucide-react'

const packageInfo: Record<string, { name: string; color: string; features: string[] }> = {
  bronze: { name: 'Bronze', color: 'from-blue-500 to-cyan-600', features: ['Basic Forex Course', 'Limited Signals', 'Email Support'] },
  silver: { name: 'Silver', color: 'from-purple-500 to-violet-600', features: ['Intermediate Course', 'Daily Signals', 'Priority Support'] },
  gold: { name: 'Gold', color: 'from-yellow-500 to-orange-600', features: ['Full Course Access', 'Premium Signals', '1-on-1 Mentorship'] },
  free: { name: 'Free', color: 'from-slate-500 to-slate-600', features: ['Basic Courses', 'Limited Signals'] },
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; full_name?: string; id: string } | null>(null)
  const [subscription, setSubscription] = useState<{ package_tier: string; end_date: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState({ activeSignals: 0, winRate: 0, coursesCompleted: 0 })

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()

        if (!data.authenticated || !data.user) {
          router.push('/auth/login')
          return
        }

        setUser({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
        })

        if (data.user.subscriptions) {
          const activeSub = Array.isArray(data.user.subscriptions)
            ? data.user.subscriptions.find((s: { status: string }) => s.status === 'active')
            : data.user.subscriptions
          if (activeSub) {
            setSubscription(activeSub)
          }
        }
      } catch (error) {
        router.push('/auth/login')
        return
      }

      try {
        const [signalsRes, tutorialsRes] = await Promise.all([
          fetch('/api/signals/count'),
          fetch('/api/tutorials/count'),
        ])
        
        const signalsData = await signalsRes.json()
        const tutorialsData = await tutorialsRes.json()

        setStats({
          activeSignals: signalsData.count || 0,
          winRate: 0,
          coursesCompleted: tutorialsData.count || 0,
        })
      } catch {
        setStats({ activeSignals: 0, winRate: 0, coursesCompleted: 0 })
      }

      setIsLoading(false)
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {}
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const userTier = subscription?.package_tier || 'free'
  const pkgInfo = packageInfo[userTier] || packageInfo.free
  const daysLeft = subscription?.end_date 
    ? Math.max(0, Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-yellow-500 p-1.5 rounded-lg">
                <TrendingUp size={20} className="text-slate-950" />
              </div>
              <span className="font-bold text-xl">
                GALILEE<span className="text-yellow-500">FX</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/Signals" className="text-slate-300 hover:text-white">Signals</Link>
              <Link href="/Courses" className="text-slate-300 hover:text-white">Courses</Link>
              <Link href="/Profile" className="text-slate-300 hover:text-white">Profile</Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-300 hover:text-red-400"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 p-4 space-y-4">
            <Link href="/Signals" className="block text-slate-300">Signals</Link>
            <Link href="/Courses" className="block text-slate-300">Courses</Link>
            <Link href="/Profile" className="block text-slate-300">Profile</Link>
            <button onClick={handleLogout} className="text-red-400">Logout</button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.full_name || 'Trader'}!
          </h1>
          <p className="text-slate-400 mt-1">Track your progress and access your trading tools</p>
        </div>

        {/* Package Card */}
        <div className={`bg-gradient-to-r ${pkgInfo.color} p-1 rounded-3xl mb-8`}>
          <div className="bg-slate-900 rounded-3xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-slate-400 text-sm">Your Package</p>
                <h2 className="text-3xl font-bold mt-1">{pkgInfo.name} Member</h2>
                {daysLeft !== null && (
                  <p className="text-slate-400 text-sm mt-2 flex items-center gap-2">
                    <Clock size={16} />
                    {daysLeft > 0 ? `${daysLeft} days remaining` : 'Subscription expired'}
                  </p>
                )}
              </div>
              <Link 
                href="/payment"
                className="bg-yellow-500 text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition"
              >
                {userTier === 'free' ? 'Upgrade Package' : 'Renew Subscription'}
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <Target className="text-yellow-500" size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Signals</p>
                <p className="text-2xl font-bold">{stats.activeSignals}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <BarChart3 className="text-green-500" size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold">{stats.winRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <BookOpen className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Courses Available</p>
                <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/Signals"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-yellow-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-xl">
                  <TrendingUp className="text-yellow-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">View Signals</h3>
                  <p className="text-slate-400 text-sm">Access live trading signals</p>
                </div>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-yellow-500" size={20} />
            </div>
          </Link>

          <Link 
            href="/Courses"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-yellow-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <BookOpen className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">My Courses</h3>
                  <p className="text-slate-400 text-sm">Continue learning</p>
                </div>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-yellow-500" size={20} />
            </div>
          </Link>

          <Link 
            href="/payment"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-yellow-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/20 p-3 rounded-xl">
                  <CreditCard className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Billing</h3>
                  <p className="text-slate-400 text-sm">Manage subscription</p>
                </div>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-yellow-500" size={20} />
            </div>
          </Link>

          <Link 
            href="/Profile"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-yellow-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <Bell className="text-purple-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Profile</h3>
                  <p className="text-slate-400 text-sm">Account settings</p>
                </div>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-yellow-500" size={20} />
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
