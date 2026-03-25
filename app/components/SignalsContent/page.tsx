'use client';

import { useEffect, useState } from 'react';

interface Signal{
  Id:number;
  Pair:string;
  Action:string;
  Entry:number;
  SL:number;
  TP:number;
  Time:string
  Status:string;
}

export default function SignalsContent() {
  const [signals,setIsSignals] = useState<Signal[]>([]);

    const getSignal =()=>{
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signals`)
      .then(res=>res.json())
      .then(json=>setIsSignals(json))
    };
  
    useEffect(()=>{
        getSignal()
    },[])
  

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Trading Signals</h1>
        <button className="bg-linear-to-r from-yellow-500 to-orange-600 text-black font-semibold px-8 py-3 rounded-2xl hover:scale-105 transition">
          + New Signal
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-950">
            <tr>
              <th className="text-left p-6">Pair</th>
              <th className="text-left p-6">Type</th>
              <th className="text-left p-6">Entry Price</th>
              <th className="text-left p-6">Stop Loss</th>
              <th className="text-left p-6">Take Profit</th>
              <th className="text-left p-6">Status</th>
              <th className="text-left p-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {signals.map((signal) => (
              <tr key={signal.Id} className="hover:bg-gray-800/50">
                <td className="p-6 font-medium">{signal.Pair}</td>
                <td className={`p-6 font-bold ${signal.Action === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                  {signal.Action}
                </td>
                <td className="p-6">{signal.Entry}</td>
                <td className="p-6 text-red-400">{signal.SL}</td>
                <td className="p-6 text-green-400">{signal.TP}</td>
                <td className="p-6">
                  <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                    signal.Status === 'Open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {signal.Status}
                  </span>
                </td>
                <td className="p-6">
                  <button className="text-yellow-500 hover:text-yellow-400 mr-4">Edit</button>
                  <button className="text-red-500 hover:text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}