'use client';

import { useEffect, useState } from 'react';

interface StatData {
  activeSignals: number;
  totalStudents: number;
  revenue: number;
  successRate: number;
}

interface RecentSignal {
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  stop_loss: number;
  take_profit: number;
  created_at: string;
}

export default function DashboardContent() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [recentSignals, setRecentSignals] = useState<RecentSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch active signals count
      const signalsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signals?status=active`);
      const signalsJson = await signalsRes.json();
      const activeSignals = signalsJson.success ? signalsJson.signals?.length || 0 : 0;
      
      // Fetch tutorials/courses count (students approximation)
      const tutorialsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tutorials`);
      const tutorialsJson = await tutorialsRes.json();
      const totalStudents = tutorialsJson.success ? tutorialsJson.tutorials?.length || 0 : 0;
      
      // For now, we'll use placeholder values for revenue and success rate
      // In a real app, these would come from payments/analytics APIs
      setStats({
        activeSignals,
        totalStudents: Math.max(totalStudents, 100), // Ensure minimum for display
        revenue: 124.8, // Placeholder - would come from payments API
        successRate: 87   // Placeholder - would come from signal analytics
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      // Fallback values
      setStats({
        activeSignals: 0,
        totalStudents: 0,
        revenue: 0,
        successRate: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentSignals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signals?status=active&limit=5`);
      const json = await res.json();
      if (json.success) {
        // Transform signal data to match dashboard format
        const signals = json.signals?.map((signal: any) => ({
          pair: signal.pair,
          type: signal.action as 'BUY' | 'SELL',
          entry: parseFloat(signal.entry_price),
          stop_loss: parseFloat(signal.stop_loss),
          take_profit: parseFloat(signal.take_profit),
          created_at: signal.created_at
        })) || [];
        setRecentSignals(signals);
      }
    } catch (error) {
      console.error("Failed to fetch recent signals:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentSignals();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (isLoading || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your Forex platform today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Active Signals</p>
          <p className="text-5xl font-bold mt-4">{stats.activeSignals}</p>
          <p className="text-green-500 text-sm mt-2">↑ 5 from yesterday</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Total Students</p>
          <p className="text-5xl font-bold mt-4">{stats.totalStudents}</p>
          <p className="text-green-500 text-sm mt-2">↑ 23 this month</p>
          <p className="text-5xl font-bold mt-4">{signals?.length}</p>
          <p className="text-green-500 text-sm mt-2">↑  from yesterday</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Total Students</p>
          <p className="text-5xl font-bold mt-4">{students?.length}</p>
          <p className="text-green-500 text-sm mt-2">↑ this month</p>
        </div>
        {/* <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Revenue (TZS)</p>
          <p className="text-5xl font-bold mt-4">{stats.revenue}.0M</p>
          <p className="text-5xl font-bold mt-4">{}</p>
          <p className="text-green-500 text-sm mt-2">↑ 18% this month</p>
        </div> */}
        {/* <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Success Rate</p>
          <p className="text-5xl font-bold mt-4">{stats.successRate}%</p>
          <p className="text-green-500 text-sm mt-2">+4% this week</p>
        </div>
          <p className="text-5xl font-bold mt-4">Top</p>
          <p className="text-green-500 text-sm mt-2">Higher this week</p>
        </div> */}
      </div>

      {/* Recent Signals */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Signals</h2>
          <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium">View Signals⬇</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4">Pair</th>
                <th className="text-left py-4">Type</th>
                <th className="text-left py-4">Entry</th>
                <th className="text-left py-4">SL</th>
                <th className="text-left py-4">TP</th>
                <th className="text-left py-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentSignals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    No recent signals available
              {signals?.map((signal,index) => (
                <tr 
                key={index}
                className="hover:bg-gray-800/50">
                  <td className="py-5 font-medium">{signal.entry}</td>
                  <td className={`py-5 font-bold ${signal.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                    {signal.type}
                  </td>
                </tr>
              ) : (
                recentSignals.map((signal, i) => (
                  <tr key={i} className="hover:bg-gray-800/50">
                    <td className="py-5 font-medium">{signal.pair}</td>
                    <td className={`py-5 font-bold ${signal.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                      {signal.type}
                    </td>
                    <td className="py-5">{signal.entry.toFixed(4)}</td>
                    <td className="py-5 text-red-400">{signal.stop_loss.toFixed(4)}</td>
                    <td className="py-5 text-green-400">{signal.take_profit.toFixed(4)}</td>
                    <td className="py-5 text-gray-400">{timeAgo(signal.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}