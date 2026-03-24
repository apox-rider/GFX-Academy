'use client'
// src/pages/index.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Navbar from './components/Header/page';
import Hero from './components/Hero/page';
import PackagesSection from './components/package/page';
import SignalsTeaser from './components/Signal/page';
import TestimonialsSection from './components/Testimonial/page';
import CTASection from './components/CTA/page';
import Footer from './components/Footer/page';
 

interface Package {
  id: number;
  name: string;
  price: number;
  duration: string;
  features: string[];
  color: string;
}

interface Signal {
  pair: string;
  type: string;
  entry: string;
  sl: string;
  tp: string;
  time: string;
}

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, sigRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/packages`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/signals/active?limit=2`),
        ]);

        if (pkgRes.ok) setPackages(await pkgRes.json());
        if (sigRes.ok) setSignals(await sigRes.json());
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Static fallback data (loaded immediately for better UX)
  const fallbackPackages: Package[] = [
    {
      id: 1,
      name: 'Bronze',
      price: 25000,
      duration: '1 month',
      features: [
        'Technical Analysis',
        'Fundamental Analysis',
        'Weekly Market Recap',
        'Trading Psychology',
        'Risk Management',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      name: 'Silver',
      price: 100000,
      duration: '2 months',
      features: [
        'Everything in Bronze',
        'Prop Firm Videos',
        '1 Month Live Mentorship',
        'Priority Signal Access',
      ],
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 3,
      name: 'Gold',
      price: 130000,
      duration: '3 months',
      features: [
        'Everything in Silver',
        'Full Lifetime Mentorship',
        'All Future Courses Free',
        'Private WhatsApp Group',
      ],
      color: 'from-yellow-500 to-orange-600',
    },
  ];

  const fallbackSignals: Signal[] = [
    { pair: 'EUR/USD', type: 'BUY', entry: '1.0825', sl: '1.0780', tp: '1.0900', time: 'Just now' },
    { pair: 'GBP/JPY', type: 'SELL', entry: '189.45', sl: '189.95', tp: '188.20', time: '12 min ago' },
  ];

  const currentPackages = packages.length > 0 ? packages : fallbackPackages;
  const currentSignals = signals.length > 0 ? signals : fallbackSignals;

  if (loading && packages.length === 0 && signals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <>
  

      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <Hero />
        <PackagesSection packages={currentPackages} />
        <SignalsTeaser signals={currentSignals} />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}