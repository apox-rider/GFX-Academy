// src/components/home/CTASection.tsx
import Link from 'next/link';
import { Rocket, ShieldCheck, Zap } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-28 bg-slate-950 overflow-hidden" aria-label="Call to action">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <Zap size={12} className="text-yellow-500" /> Fast Execution
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <ShieldCheck size={12} className="text-yellow-500" /> Secure Payments
          </div>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Ready to Trade <br />
          <span className="text-yellow-500">Like a Professional?</span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join over 5,000+ Tanzanian traders who have stopped guessing and started following a proven, institutional system.
        </p>

        <div className="flex flex-col items-center gap-6">
          <Link
            href="/auth/register"
            className="group relative inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xl md:text-2xl px-12 py-5 rounded-2xl transition-all shadow-[0_20px_50px_rgba(234,179,8,0.2)] hover:-translate-y-1 active:scale-95"
            aria-label="Get started with registration"
          >
            Start Your Journey Now
            <Rocket className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={24} />
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-slate-500 text-sm font-medium">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Instant Dashboard Access
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Mobile Money Supported
            </span>
          </div>
        </div>

        <p className="mt-12 text-xs text-slate-600 uppercase tracking-[0.2em]">
          No Credit Card Required • Start for as low as TZS 25,000
        </p>
      </div>
    </section>
  );
}