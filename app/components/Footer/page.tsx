// src/components/common/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <div className="font-orbitron text-3xl mb-4">GFX Academy</div>
          <p className="text-sm text-gray-400">Professional Forex Education for Tanzania</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm" role="list">
            <li><Link href="/dashboard/courses">Courses</Link></li>
            <li><Link href="/dashboard/signals">Signals</Link></li>
            <li><Link href="/dashboard/referral">Referrals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm" role="list">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Payments</h4>
          <p className="text-sm text-gray-400">M-Pesa • Tigo Pesa • Airtel Money • Bank Cards</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-12 border-t border-gray-800 pt-8">
        © 2026 GalileeFX Academy • Mbeya, Tanzania
      </div>
    </footer>
  );
}