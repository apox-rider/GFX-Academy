// src/components/home/Hero.tsx
import { ExternalLink, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { GiAerialSignal } from 'react-icons/gi';
import { MdPhoneAndroid } from "react-icons/md";
import { SiCodementor } from 'react-icons/si';

export default function Hero() {
  const features = [
    { title: 'Live Signals', desc: 'Daily Buy/Sell alerts sent directly to your dashboard and Telegram.', icon: <GiAerialSignal /> },
    { title: 'Local Payments', desc: 'No credit card? No problem. Use M-Pesa or Tigo Pesa instantly.', icon: <MdPhoneAndroid /> },
    { title: 'Expert Mentors', desc: 'Weekly Zoom sessions with traders who actually live off the markets.', icon: <SiCodementor /> },
  ];

  const brokers = [
    { 
      name: 'HFM', 
      url: 'https://www.hfm.com/sv/en/?refid=30462532', 
      tag: 'Best for Forex',
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
      desc: 'Known for ultra-low spreads and fast execution. Perfect for scalpers and professional traders looking for a stable global platform.'
    },
    { 
      name: 'Equiti (FX Pesa)', 
      url: 'https://portal.my-equiti.com/sc/register/?clickid=1039657&affid=C02130171', 
      tag: 'Local Favorite',
      icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
      desc: 'The top choice for East African traders. Licensed locally with easy deposit and withdrawal options tailored for our region.'
    },
    { 
      name: 'Deriv', 
      url: 'https://deriv.partners/rx?sidc=12C8D041-877F-4712-857B-29CD3031CCBE&utm_campaign=dynamicworks&utm_medium=affiliate&utm_source=CU287683', 
      tag: '24/7 Trading',
      icon: <Zap className="w-6 h-6 text-red-400" />,
      desc: 'The go-to platform for Synthetic Indices (Volatility). Trade 24/7, even on weekends, with a simple and intuitive interface.'
    },
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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
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
            href="/auth/register"
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
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="text-4xl mb-4 text-yellow-500">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Brokers Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-white mb-4">Partner Brokers</h2>
                <p className="text-slate-400">
                    We only recommend brokers that provide **local support**, **fair spreads**, and **reliable withdrawals** for our community.
                </p>
            </div>
            <div className="hidden md:block text-slate-500 text-sm font-medium border-l border-slate-800 pl-4">
                Regulated Platforms <br /> Trusted Globally
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {brokers.map((broker, idx) => (
            <a 
              key={idx} 
              href={broker.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-yellow-500/50 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-yellow-500/30">
                    {broker.icon}
                </div>
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                  {broker.tag}
                </span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                {broker.name}
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-yellow-500 transition-colors" />
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {broker.desc}
              </p>
              <div className="mt-auto pt-4 border-t border-slate-800 group-hover:border-yellow-500/20">
                <span className="text-yellow-500 text-sm font-bold group-hover:underline">Open Live Account &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}