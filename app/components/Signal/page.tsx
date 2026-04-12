// src/components/home/SignalsTeaser.tsx
import Link from 'next/link';
import { Radio, ArrowRight, Lock } from 'lucide-react';

interface Signal { pair: string; type: string; entry: string; sl: string; tp: string; time: string; }

interface Props { signals: Signal[]; }

const defaultSignals: Signal[] = [
  { pair: 'EUR/USD', type: 'BUY', entry: '1.0825', sl: '1.0780', tp: '1.0900', time: 'Just now' },
  { pair: 'GBP/JPY', type: 'SELL', entry: '189.45', sl: '189.95', tp: '188.20', time: '12 min ago' },
]

export default function SignalsTeaser({ signals }: Props) {
  const displaySignals = signals && signals.length > 0 ? signals : defaultSignals
  return (
    <section className="py-24 bg-slate-950 border-y border-slate-900" aria-label="Live trading signals teaser">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Institutional Grade <br />
              <span className="text-slate-400">Trading Signals.</span>
            </h2>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl">
              Don't guess the market. Receive precise Entry, Stop Loss, and Take Profit levels 
              analyzed by our expert traders, delivered instantly to your device.
            </p>
            
            <Link
              href="/auth/Register"
              className="mt-8 group inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold text-lg transition-all"
            >
              Get Full Access 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Signals Preview Cards */}
          <div className="flex-1 w-full grid gap-4">
            {displaySignals.map((s, i) => (
              <div
                key={i}
                className="relative bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex justify-between items-center transition-all hover:bg-slate-900/60 overflow-hidden"
              >
                {/* Background Glow Effect */}
                <div className={`absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 blur-md ${s.type === 'BUY' ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                <div>
                  <div className="font-mono text-xl text-slate-400">{s.pair}</div>
                  <div className={`text-3xl font-black tracking-tighter ${
                    s.type === 'BUY' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.3)]'
                  }`}>
                    {s.type}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {/* Blurring out the sensitive data for the teaser */}
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500 font-medium uppercase tracking-tighter text-xs">Entry</span>
                    <span className="font-mono text-slate-300 blur-xs select-none">1.08450</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500 font-medium uppercase tracking-tighter text-xs">Target</span>
                    <span className="font-mono text-emerald-500/50 blur-xs select-none">1.09200</span>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <Lock size={10} />
                    Premium Only
                  </div>
                </div>
              </div>
            ))}

            {/* Sub-note */}
            <p className="text-center text-slate-600 text-xs mt-2 italic">
              Signals are updated in real-time. Join the Gold package for 95% accuracy alerts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}