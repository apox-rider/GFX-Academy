import { useEffect, useState } from "react";
import { json } from "stream/consumers";
interface Dashboard{
  pair:string;
  type:string;
  entry:number;
  sl:number;
  tp:number;
  time:string|number
}

export default function DashboardContent() {
  const [signal,setIsSignal]=useState<Dashboard[]>()
  const [students,setIsStudent]=useState<Dashboard[]>()

  const getSignals=async()=>{await
    fetch(`/api/signals`)
    .then(res=>res.json())
    .then(json=>setIsSignal(json))
  }
  const getStudents=async()=>{await
    fetch(`/api/signals?status=active`)
    .then(res=>res.json())
    .then(json=>setIsStudent(json))
  }
 
  useEffect(()=>{
    getSignals()
    getStudents()
  },[])
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your Forex platform today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Active Signals</p>
          <p className="text-5xl font-bold mt-4">{signal?.length}</p>
          <p className="text-green-500 text-sm mt-2">↑  from yesterday</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Total Students</p>
          <p className="text-5xl font-bold mt-4">{students?.length}</p>
          <p className="text-green-500 text-sm mt-2">↑ this month</p>
        </div>
        {/* <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Revenue (TZS)</p>
          <p className="text-5xl font-bold mt-4">{}</p>
          <p className="text-green-500 text-sm mt-2">↑ 18% this month</p>
        </div> */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Success Rate</p>
          <p className="text-5xl font-bold mt-4">Top</p>
          <p className="text-green-500 text-sm mt-2">Higher this week</p>
        </div>
      </div>

      {/* Recent Signals */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Signals</h2>
          <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium">View Signals⬇️</button>
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
              {signal?.map((s, i) => (
                <tr key={i} className="hover:bg-gray-800/50">
                  <td className="py-5 font-medium">{s.entry}</td>
                  <td className={`py-5 font-bold ${s.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                    {s.type}
                  </td>
                  <td className="py-5">{s.entry}</td>
                  <td className="py-5 text-red-400">{s.sl}</td>
                  <td className="py-5 text-green-400">{s.tp}</td>
                  <td className="py-5 text-gray-400">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}