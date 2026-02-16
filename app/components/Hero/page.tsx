// src/components/home/Hero.tsx
import { AlignVerticalJustifyStartIcon, GitGraph, HatGlasses, PhoneForwardedIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const features = [
  { title: 'Live Signals', desc: 'Daily Buy/Sell alerts sent directly to your dashboard and Telegram.', icon: <AlignVerticalJustifyStartIcon/> },
  { title: 'Local Payments', desc: 'No credit card? No problem. Use M-Pesa or Tigo Pesa instantly.', icon: <PhoneForwardedIcon/> },
  { title: 'Expert Mentors', desc: 'Weekly Zoom sessions with traders who actually live off the markets.', icon: <HatGlasses/> },
];
  return (
    <section className="relative bg-slate-950 text-slate-50 overflow-hidden border-b border-slate-800">
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      
      <div className="flex justify-center absolute inset-0 opacity-20">
        <img
          src="WhatsApp Image 2026-02-15 at 15.59.02.jpeg" 
          alt="Forex Charts"
          className="object-cover grayscale"
        />
        
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-yellow-500 uppercase bg-yellow-500/10 border border-yellow-500/20 rounded-full">
          Trusted by 5,000+ Tanzanian Traders
        </div> */}
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-slate-400">
          Master Forex.<br />Trade with Confidence.
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Structured courses, real-time signals, and expert mentorship. 
          <span className="block mt-2 text-slate-300 font-medium text-lg">
            Pay via M-Pesa, Tigo Pesa, or Airtel Money.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/Register"
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          >
            Start Free – Register Now
          </Link>
          <Link
            href="#packages"
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all"
          >
            View Packages
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
      <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    
    
    </section>
  );
}