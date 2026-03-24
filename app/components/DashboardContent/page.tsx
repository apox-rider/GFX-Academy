export default function DashboardContent() {
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
          <p className="text-5xl font-bold mt-4">18</p>
          <p className="text-green-500 text-sm mt-2">↑ 5 from yesterday</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Total Students</p>
          <p className="text-5xl font-bold mt-4">347</p>
          <p className="text-green-500 text-sm mt-2">↑ 23 this month</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Revenue (TZS)</p>
          <p className="text-5xl font-bold mt-4">124.8M</p>
          <p className="text-green-500 text-sm mt-2">↑ 18% this month</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <p className="text-gray-400 text-sm">Success Rate</p>
          <p className="text-5xl font-bold mt-4">87%</p>
          <p className="text-green-500 text-sm mt-2">+4% this week</p>
        </div>
      </div>

      {/* Recent Signals */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Signals</h2>
          <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium">View All Signals →</button>
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
              {[
                { pair: "EUR/USD", type: "BUY", entry: "1.0850", sl: "1.0800", tp: "1.0950", time: "2 min ago" },
                { pair: "GBP/JPY", type: "SELL", entry: "191.25", sl: "191.80", tp: "189.50", time: "15 min ago" },
                { pair: "XAU/USD", type: "BUY", entry: "2650.50", sl: "2638.00", tp: "2680.00", time: "1 hour ago" },
              ].map((signal, i) => (
                <tr key={i} className="hover:bg-gray-800/50">
                  <td className="py-5 font-medium">{signal.pair}</td>
                  <td className={`py-5 font-bold ${signal.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                    {signal.type}
                  </td>
                  <td className="py-5">{signal.entry}</td>
                  <td className="py-5 text-red-400">{signal.sl}</td>
                  <td className="py-5 text-green-400">{signal.tp}</td>
                  <td className="py-5 text-gray-400">{signal.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}