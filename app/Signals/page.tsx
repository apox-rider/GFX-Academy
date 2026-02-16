// src/components/signals/Signals.tsx
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Header/page';
import Footer from '../components/Footer/page';

export default function Signals() {
  const signals = [
    { pair: 'EUR/USD', action: 'Buy', entry: '1.0850', sl: '1.0800', tp: '1.0950', time: '2023-10-01 09:00', status: 'Open' },
    { pair: 'GBP/USD', action: 'Sell', entry: '1.3100', sl: '1.3150', tp: '1.3000', time: '2023-10-01 10:30', status: 'Closed' },
    { pair: 'USD/JPY', action: 'Buy', entry: '150.20', sl: '149.50', tp: '151.50', time: '2023-10-01 11:45', status: 'Open' },
    // Add more placeholder signals as needed
  ];

  return (
    <>
    <Navbar/>
    <section className="relative bg-slate-950 text-slate-50 overflow-hidden border-b border-slate-800">
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/signals-bg.jpeg" // Replace with a suitable signals page background image, e.g., charts
          alt="Signals Background"
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-yellow-500 uppercase bg-yellow-500/10 border border-yellow-500/20 rounded-full">
          Trusted by 5,000+ Tanzanian Traders
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Live Forex Signals<br />Trade Smarter
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Receive daily Buy/Sell alerts directly to your dashboard and Telegram. 
          <span className="block mt-2 text-slate-300 font-medium text-lg">
            Backed by expert analysis for Tanzanian traders.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          >
            Get Signals – Register Now
          </Link>
          <Link
            href="#recent-signals"
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all"
          >
            View Recent Signals
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-slate-500 grayscale opacity-70">
          <span className="text-xs font-semibold tracking-widest uppercase">Integration Partners:</span>
          {/* Add small logos for M-Pesa / Tigo here */}
          <span className="text-sm font-medium">M-Pesa</span>
          <span className="text-sm font-medium">Tigo Pesa</span>
          <span className="text-sm font-medium">Airtel Money</span>
        </div>
      </div>

      <section id="recent-signals" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Recent Trading Signals
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Pair</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Entry</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">SL</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">TP</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/50 divide-y divide-slate-800">
                {signals.map((signal, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{signal.pair}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{signal.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.entry}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.sl}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.tp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            How Our Signals Work
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Our signals are generated by expert traders using advanced analysis. Get notified in real-time via dashboard or Telegram.
            Subscribe today to start receiving them.
          </p>
          <Link
            href="#packages"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all"
          >
            View Subscription Packages
          </Link>
        </div>
      </section>
    </section>
    <Footer/>
    </>
  );
}