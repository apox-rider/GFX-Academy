// src/components/home/SignalsTeaser.tsx
import Link from 'next/link';
import { signals } from './mockData'; // Or pass as prop

interface Signal { pair: string; type: string; entry: string; sl: string; tp: string; time: string; }

interface Props { signals: Signal[]; }

export default function SignalsTeaser({ signals }: Props) {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 to-blue-900 text-white" aria-label="Live trading signals teaser">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-block bg-white/10 text-white text-sm px-4 py-1 rounded-full mb-4">
              LIVE SIGNALS
            </div>
            <h2 className="text-4xl font-orbitron">Real-time Trading Signals</h2>
            <p className="mt-6 text-xl text-blue-100">
              Get instant BUY / SELL alerts with Entry, Stop Loss &amp; Take Profit. Only for subscribed members.
            </p>
            <Link
              href="/dashboard/signals"
              className="mt-4 inline-block text-yellow-400 hover:text-yellow-300 font-semibold"
            >
              Upgrade to View All →
            </Link>
          </div>

          <div className="flex-1 grid gap-4" role="list" aria-label="Recent signals">
            {signals.map((s, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl flex justify-between items-center group hover:bg-white/20 transition"
                role="listitem"
              >
                <div>
                  <div className="font-mono text-2xl">{s.pair}</div>
                  <div className={`text-3xl font-bold ${s.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                    {s.type}
                  </div>
                </div>
                <div className="text-right">
                  <div>Entry <span className="font-mono">{s.entry}</span></div>
                  <div>SL <span className="font-mono text-red-400">{s.sl}</span></div>
                  <div>TP <span className="font-mono text-green-400">{s.tp}</span></div>
                  <div className="text-xs text-white/60 mt-2">{s.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}