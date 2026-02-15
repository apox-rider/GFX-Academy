// src/pages/index.tsx
import Head from 'next/head';
import { GetServerSideProps } from 'next';
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

export default function Home({ packages, signals }: { packages: Package[]; signals: any[] }) {
  return (
    <>
      <Head>
        <title>GalileeFX Academy - Forex Trading Education in Tanzania</title>
        <meta name="description" content="Professional Forex courses, real-time signals, mentorship & Selcom payments. Start trading smarter today." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://gfxacademy.com" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <Hero />
        <PackagesSection packages={packages} />
        <SignalsTeaser signals={signals} />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch dynamic data from backend (SRS API)
  let packages: Package[] = [];
  let signals: any[] = [];

  try {
    const [pkgRes, sigRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/packages`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/signals/active?limit=2`),
    ]);

    if (pkgRes.ok) packages = await pkgRes.json();
    if (sigRes.ok) signals = await sigRes.json();
  } catch (error) {
    console.error('Failed to fetch home data:', error);
  }

  // Fallback static data (remove in production)
  packages = packages.length ? packages : [
    {
      id: 1,
      name: 'Bronze',
      price: 25000,
      duration: 'One-time',
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
      duration: '2 Months',
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
      duration: 'Lifetime',
      features: [
        'Everything in Silver',
        'Full Lifetime Mentorship',
        'All Future Courses Free',
        'Private WhatsApp Group',
      ],
      color: 'from-yellow-500 to-orange-600',
    },
  ];

  signals = signals.length ? signals : [
    { pair: 'EUR/USD', type: 'BUY', entry: '1.0825', sl: '1.0780', tp: '1.0900', time: 'Just now' },
    { pair: 'GBP/JPY', type: 'SELL', entry: '189.45', sl: '189.95', tp: '188.20', time: '12 min ago' },
  ];

  return { props: { packages, signals } };
};