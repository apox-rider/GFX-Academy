'use client'
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Header/page';
import Footer from '../components/Footer/page';
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

export default function Signals() {
  const [signals,setSignals]=useState<Signal[]>([]);
  const [isGoldUser, setIsGoldUser] = useState<boolean | null>(null); // null = loading

  const getSignal =()=>{
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signals`)
      .then(res=>res.json())
      .then(json=>setSignals(json));
  };

  // Check user package (Gold only)
  useEffect(()=>{
    const userPackage = localStorage.getItem('userPackage'); // e.g. "Gold", "Silver", "Bronze", or null
    
    if (userPackage === 'Gold') {
      setIsGoldUser(true);
      getSignal();
    } else {
      setIsGoldUser(false);
    }
  },[]);

  // If still checking package
  if (isGoldUser === null) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Checking access...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // If not Gold user → Show locked screen
  if (!isGoldUser) {
    return (
      <>
        <Navbar />
        <section className="relative bg-slate-950 text-slate-50 min-h-screen flex items-center">
          <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-violet-500/10 rounded-full mb-8">
                <span className="text-5xl">👑</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Gold Package Only
              </h1>
              
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                Live Forex Signals are exclusive to <span className="text-yellow-400 font-medium">Gold Package</span> members.
              </p>

              <div className="space-y-4">
                <Link
                  href="/Packages"
                  className="block w-full bg-gradient-to-r from-violet-500 to-yellow-500 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all hover:scale-105"
                >
                  Upgrade to Gold Package
                </Link>
                
                <Link
                  href="/"
                  className="block w-full border border-slate-700 hover:bg-slate-900 text-white font-medium py-5 rounded-2xl transition-all"
                >
                  Back to Homepage
                </Link>
              </div>

              <p className="text-sm text-slate-500 mt-12">
                Already a Gold member? <span className="text-yellow-400">Login again</span> to refresh access.
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // Gold user → Show full Signals page (original design untouched)
  return (
    <>
    <Navbar/>
    <section className="relative bg-slate-950 text-slate-50 overflow-hidden border-b border-slate-800">
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      
      <div className="flex  absolute inset-0 opacity-20">
        <img
          src="https://fxmedia.s3.amazonaws.com/articles/free_forex_trading_signals-1.jpg"  
          alt="Signals Background"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-slate-400">
          Live Forex Signals<br/>Trade Smarter
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
              <thead className="bg-amber-950">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Pair</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Entry</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">SL</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">TP</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-slate-800">
                {signals.map((signal) => (
                  <tr key={signal.Id} >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{signal.Pair}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{signal.Action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.Entry}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.SL}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.TP}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.Time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.Status}</td>
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