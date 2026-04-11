// src/components/home/PackagesSection.tsx
import Link from 'next/link';
import { Check, ShieldCheck } from 'lucide-react';

interface Package {
  id: number;
  name: string;
  price: number;
  duration: string;
  features: string[];
  color: string;  
}

interface Props { packages: Package[]; }

const defaultPackages: Package[] = []

export default function PackagesSection({ packages }: Props) {
  const displayPackages = packages && packages.length > 0 ? packages : defaultPackages
  return (
    <section id="packages" className="py-24 bg-slate-950 text-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="text-yellow-500 w-12 h-12" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Choose Your Path to Profit
          </h2>
          <p className="text-xl text-slate-400 mt-4 max-w-2xl mx-auto">
            Flexible plans designed for the Tanzanian market. Start small or go lifetime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {displayPackages.map((pkg) => (
            <article  
              key={pkg.id} 
              className="relative bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 group flex flex-col"
            >
              {/* Top Accent Bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${pkg.name === 'Gold' ? 'from-yellow-600 to-yellow-400' : 'from-slate-700 to-slate-500'}`} />
              
              <div className="p-8 flex flex-col grow">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-slate-400 font-medium">TZS</span>
                    <span className="text-4xl font-bold text-white leading-none">
                      {pkg.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-yellow-500/80 font-bold mt-2">
                    {pkg.duration}
                  </div>
                </div>

                <ul className="space-y-4 mb-10 grow" role="list">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <Check className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/auth/Register?package=${pkg.id}`}
                  className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${
                    pkg.name === 'Gold' 
                    ? 'bg-yellow-500 text-slate-950 hover:bg-yellow-400 shadow-lg shadow-yellow-500/10' 
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  Enroll Now
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Comparison Table: Professional Slate Style */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            Plan Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-widest">
                  <th className="pb-4 px-4 font-semibold">Feature</th>
                  {displayPackages.map((pkg) => (
                    <th key={pkg.id} className="pb-4 px-4 text-center font-semibold">{pkg.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="bg-slate-800/30 rounded-lg">
                  <td className="py-4 px-4 rounded-l-lg text-slate-300 font-medium border-y border-l border-slate-800/50">One-time Price</td>
                  {displayPackages.map((pkg) => (
                    <td key={pkg.id} className="text-center py-4 border-y border-slate-800/50 text-white font-mono">
                      {pkg.price.toLocaleString()}
                    </td>
                  ))}
                  <td className="rounded-r-lg border-y border-r border-slate-800/50"></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-slate-300 font-medium">Mentorship Access</td>
                  {displayPackages.map((pkg) => (
                    <td key={pkg.id} className="text-center py-4 text-slate-400 italic">
                      {pkg.name === 'Bronze' ? 'Community Only' : pkg.name === 'Silver' ? '1 Month Direct' : 'Lifetime Direct'}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-800/30">
                  <td className="py-4 px-4 rounded-l-lg text-slate-300 font-medium border-y border-l border-slate-800/50">Signal Priority</td>
                  {displayPackages.map((pkg) => (
                    <td key={pkg.id} className="text-center py-4 border-y border-slate-800/50 text-white">
                      {pkg.name === 'Gold' ? 'Instant Alert' : 'Standard'}
                    </td>
                  ))}
                  <td className="rounded-r-lg border-y border-r border-slate-800/50"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-500 text-xs uppercase tracking-widest">
          Secure Payments processed via local M-Pesa / Tigo Pesa integration
        </p>
      </div>
    </section>
  );
}