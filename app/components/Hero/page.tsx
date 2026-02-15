// src/components/home/Hero.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="relative bg-linear-to-br from-blue-950 via-purple-950 to-black text-white overflow-hidden"
      role="banner"
      aria-label="GalileeFX Academy Hero"
    >
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/images/hero-bg.jpg" // Replace with optimized asset in public/images/
          alt="Dynamic Forex charts background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-orbitron tracking-tight mb-6">
          Master Forex.<br />Trade with Confidence.
        </h1>
        <p className="text-2xl md:text-3xl text-blue-200 max-w-3xl mx-auto mb-10">
          Structured courses • Real-time BUY/SELL signals • Expert mentorship<br />
          Built for Tanzanian traders using M-Pesa, Tigo Pesa &amp; Cards
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl px-10 py-4 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-yellow-300"
            aria-label="Start free trial and register now"
          >
            Start Free – Register Now
          </Link>
          <Link
            href="#packages"
            className="border-2 border-white hover:bg-white hover:text-black font-bold text-xl px-10 py-4 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-white"
            aria-label="Scroll to see packages"
          >
            See Packages
          </Link>
        </div>
        <p className="mt-8 text-sm text-blue-300">✓ 100% Tanzanian payment methods ✓ Instant access after payment</p>
      </div>
    </section>
  );
}