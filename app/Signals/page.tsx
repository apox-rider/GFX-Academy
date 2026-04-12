'use client'
import Link from 'next/link';
import Navbar from '../components/Header/page';
import Footer from '../components/Footer/page';
import { useEffect, useState } from 'react';

interface Signal {
  id: string;
  pair: string;
  action: 'BUY' | 'SELL'|'SELL STOP'|'BUY STOP'| 'SELL LIMIT '|'BUY LIMIT';
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  status: string;
  created_at: string;
  min_tier: string;
}

export default function Signals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [userTier, setUserTier] = useState<string>('free');
// Something is missing to check subscription

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);

  // const checkSubscription=async()=>{
  //   const checkSession=
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, signalsRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/signals'),
        ])

        const sessionData = await sessionRes.json()
        const signalsData = await signalsRes.json()

        if (sessionData.authenticated && sessionData.user) {
          setUser({ id: sessionData.user.id })
          
          if (sessionData.user.subscriptions) {
            const activeSub = Array.isArray(sessionData.user.subscriptions)
              ? sessionData.user.subscriptions.find((s: { status: string }) => s.status === 'active')
              : sessionData.user.subscriptions
            if (activeSub) {
              setUserTier(activeSub.package_tier || 'free')
            }
          }
        }

        if (signalsData.success && signalsData.signals) {
          setSignals(signalsData.signals)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const canAccessSignals = userTier === 'gold' || userTier === 'silver' || userTier === 'bronze' || userTier === 'free';

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (canAccessSignals) {
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
                Premium Signals
              </h1>
              
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                Live Forex Signals are exclusive to <span className="text-yellow-400 font-medium">Premium Members</span>.
              </p>

              <div className="space-y-4">
                <Link
                  href="/paymentSignals"
                  className="block w-full bg-gradient-to-r from-violet-500 to-yellow-500 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all hover:scale-105"
                >
                  Get Premium Access
                </Link>
                
                <Link
                  href="/"
                  className="block w-full border border-slate-700 hover:bg-slate-900 text-white font-medium py-5 rounded-2xl transition-all"
                >
                  Back to Homepage
                </Link>
              </div>

              {user && (
                <p className="text-sm text-slate-500 mt-12">
                  Current package: <span className="text-yellow-400">Free</span> - Upgrade to access premium signals
                </p>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar/>
      <section className="relative bg-slate-950 text-slate-50 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
        
        <div className="flex absolute inset-0 opacity-20">
          <img
            src="https://fxmedia.s3.amazonaws.com/articles/free_forex_trading_signals-1.jpg"  
            alt="Signals Background"
            className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-500 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            LIVE SIGNALS
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Live Forex Signals<br/>Trade Smarter
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Receive daily Buy/Sell alerts directly to your dashboard. 
            <span className="block mt-2 text-slate-300 font-medium text-lg">
              Backed by expert analysis for Tanzanian traders.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <div className="bg-green-500/20 text-green-400 px-6 py-3 rounded-xl font-medium">
                ✓ Logged in as {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Member
              </div>
            ) : (
              <Link
                href="/auth/Register"
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
              >
                Get Signals – Register Now
              </Link>
            )}
            <Link
              href={`${!user ? '#recent-signals':'/#packages'}`}
              className="w-full sm:w-auto bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all"
            >
              View Recent Signals
            </Link>
          </div>
        </div>

        <section id="recent-signals" className="py-16 bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
              Recent Trading Signals
            </h2>
            
            {signals.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>No active signals at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-yellow-500 uppercase tracking-wider">Pair</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-yellow-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-yellow-500 uppercase tracking-wider">Entry</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-yellow-500 uppercase tracking-wider">Stop Loss</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-yellow-500 uppercase tracking-wider">Take Profit</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-yellow-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-950 divide-y divide-slate-800">
                    {signals.map((signal) => (
                      <tr key={signal.id} className="hover:bg-slate-900/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{signal.pair}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${signal.action === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                          {signal.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{signal.entry_price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">{signal.stop_loss}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{signal.take_profit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {new Date(signal.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
        
        <section className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              How Our Signals Work
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Our signals are generated by expert traders using advanced analysis. Get notified in real-time.
            </p>
            {!user && (
              <Link
                href="/payment"
                className="inline-block bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all"
              >
                View Subscription Packages
              </Link>
            )}
          </div>
        </section>
      </section>
      <Footer/>
    </>
  );
}
