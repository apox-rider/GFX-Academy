'use client';

import { useState } from 'react';

export default function SignalsContent() {
  const [signals] = useState([
    { id: 1, pair: "EUR/USD", type: "BUY", entry: "1.0825", sl: "1.0780", tp: "1.0900", status: "Active" },
    { id: 2, pair: "GBP/JPY", type: "SELL", entry: "189.45", sl: "189.95", tp: "188.20", status: "Closed" },
    { id: 3, pair: "XAU/USD", type: "BUY", entry: "2648.75", sl: "2635.00", tp: "2675.00", status: "Active" },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Trading Signals</h1>
        <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold px-8 py-3 rounded-2xl hover:scale-105 transition">
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
              <tr key={signal.id} className="hover:bg-gray-800/50">
                <td className="p-6 font-medium">{signal.pair}</td>
                <td className={`p-6 font-bold ${signal.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                  {signal.type}
                </td>
                <td className="p-6">{signal.entry}</td>
                <td className="p-6 text-red-400">{signal.sl}</td>
                <td className="p-6 text-green-400">{signal.tp}</td>
                <td className="p-6">
                  <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                    signal.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {signal.status}
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