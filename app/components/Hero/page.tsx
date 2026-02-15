// src/components/home/Hero.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black dark:from-gray-950 dark:via-purple-950 dark:to-black text-white overflow-hidden"
      role="banner"
      aria-label="GalileeFX Academy Hero"
    >
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        <Image
          src="/images/hero-bg.jpg" // Replace with optimized asset in public/images/
          alt="Dynamic Forex charts background"
          fill
          className="object-cover brightness-50 dark:brightness-75"
          priority
          sizes="100vw"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-orbitron tracking-tight mb-6 text-white dark:text-gray-100 drop-shadow-md">
          Master Forex.<br />Trade with Confidence.
        </h1>
        <p className="text-2xl md:text-3xl text-slate-300 dark:text-blue-200 max-w-3xl mx-auto mb-10">
          Structured courses • Real-time BUY/SELL signals • Expert mentorship<br />
          Built for Tanzanian traders using M-Pesa, Tigo Pesa &amp; Cards
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="bg-yellow-500 hover:bg-yellow-400 dark:bg-yellow-400 dark:hover:bg-yellow-300 text-black font-bold text-xl px-10 py-4 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-lg dark:shadow-yellow-500/25"
            aria-label="Start free trial and register now"
          >
            Start Free – Register Now
          </Link>
          <Link
            href="#packages"
            className="border-2 border-white hover:bg-white hover:text-black dark:border-slate-200 dark:hover:bg-slate-800 dark:hover:text-white font-bold text-xl px-10 py-4 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-white dark:focus:ring-slate-300"
            aria-label="Scroll to see packages"
          >
            See Packages
          </Link>
        </div>
        <p className="mt-8 text-sm text-slate-400 dark:text-blue-300">
          ✓ 100% Tanzanian payment methods ✓ Instant access after payment
        </p>
      </div>
    </section>
  );
}