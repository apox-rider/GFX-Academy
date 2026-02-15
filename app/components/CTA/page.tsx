// src/components/home/CTASection.tsx
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-black text-white text-center" aria-label="Call to action">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-5xl font-orbitron mb-6">Ready to Trade Like a Pro?</h2>
        <p className="text-2xl mb-10">Join 500+ Tanzanian traders already winning with GalileeFX Academy</p>
        <Link
          href="/auth/register"
          className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-2xl px-16 py-5 rounded-2xl transition-all focus:outline-none focus:ring-4 focus:ring-yellow-300"
          aria-label="Get started with registration"
        >
          Get Started – Only TZS 25,000 to Begin
        </Link>
        <p className="mt-8 text-sm text-gray-400">30-day money-back guarantee • Instant access</p>
      </div>
    </section>
  );
}