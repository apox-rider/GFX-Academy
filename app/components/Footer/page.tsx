// src/components/common/Footer.tsx
import Link from 'next/link';
import { TrendingUp, Mail, MapPin, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-yellow-500 p-1 rounded-md">
                <TrendingUp size={20} className="text-slate-950" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">
                GALILEE<span className="text-yellow-500">FX</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              The #1 Forex training academy in Tanzania. Empowering local traders with professional tools and institutional knowledge.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4 text-sm" role="list">
              <li><Link href="/Courses" className="hover:text-yellow-500 transition-colors">Forex Courses</Link></li>
              <li><Link href="/auth/Register?=VIP" className="hover:text-yellow-500 transition-colors">VIP Signals</Link></li>
              <li><Link href="/auth/Register?=Referral" className="hover:text-yellow-500 transition-colors">Partner Program</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4 text-sm" role="list">
              <li><Link href="/About" className="hover:text-yellow-500 transition-colors">About Academy</Link></li>
              <li><Link href="/Contact" className="hover:text-yellow-500 transition-colors">Contact Support</Link></li>
              <li><Link href="/Privacypolicy" className="hover:text-yellow-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Location & Payments */}
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Contact Us</h4>
              <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                <MapPin size={16} className="text-yellow-500" />
                Mbeya, Tanzania
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Mail size={16} className="text-yellow-500" />
                xxx@gmail.com
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Accepted Payments</h4>
              <div className="flex flex-wrap gap-2">
                {['M-Pesa', 'Tigo Pesa', 'Airtel'].map((pay) => (
                  <span key={pay} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-400">
                    {pay}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Risk Warning Block */}
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl mb-12">
          <div className="flex gap-4">
            <ShieldAlert className="text-slate-600 shrink-0" size={24} />
            <div className="text-[11px] leading-relaxed text-slate-500">
              <strong className="text-slate-400 uppercase">High Risk Warning:</strong> Forex and CFD trading carries a high level of risk to your capital and you should only trade with money you can afford to lose. Trading may not be suitable for everyone. Please ensure that you fully understand the risks involved and seek independent advice if necessary before engaging in such transactions. GalileeFX Academy is an educational provider and does not manage client funds.
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-600 border-t border-slate-900 pt-8">
          © {new Date().getFullYear()} GalileeFX Academy. All Rights Reserved. Built for the Tanzanian Trading Community.
        </div>
      </div>
    </footer>
  );
}