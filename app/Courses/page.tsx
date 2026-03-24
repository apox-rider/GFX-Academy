'use client';

import Navbar from '../components/Header/page';
import Footer from '../components/Footer/page';
import Link from 'next/link';
import { Unlock, Star, Crown, Play, FileText } from 'lucide-react';
import { FaUnlockAlt } from 'react-icons/fa';

export default function CoursesPage() {
  const video=[
                { title: 'Introduction to Forex Trading', type: 'video', duration: '28 min' },
                { title: 'Currency Pairs Explained', type: 'video', duration: '35 min' },
                { title: 'Forex Basics PDF Guide', type: 'pdf', pages: 48 },
              ]
  return (
    <>
      <Navbar />
      <section className="relative bg-slate-950 text-slate-50 overflow-hidden">
        {/* Subtle grid background */}


        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Forex Courses &amp;<br />Video Tutorials
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto">
            Start free with Beginner level.<br />
            Unlock Intermediate &amp; Expert with a package.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/Register"
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-12 py-5 rounded-2xl transition-all shadow-xl shadow-yellow-500/30"
            >
              Start Free – Beginner Level
            </Link>
            <Link
              href="/Packages"
              className="border border-slate-700 hover:bg-slate-900 font-bold text-lg px-12 py-5 rounded-2xl transition-all"
            >
              View All Packages
            </Link>
          </div>
        </div>

        {/* Levels */}
        <div className="max-w-7xl mx-auto px-6 pb-24 space-y-24">
          
          {/* BEGINNER - FREE */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <Unlock className="w-8 h-8 text-emerald-500" />
              <div>
                <h2 className="text-4xl font-bold text-white">Beginner Level</h2>
                <p className="text-yellow-600 font-medium uppercase tracking-widest">FREE FOR EVERYONE</p>
              </div>
            </div>

            <div className="border border-dashed border-yellow-500/30 rounded-3xl p-12 text-center">
            <FaUnlockAlt className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Beginer Level</h2>
            <p className="text-emerald-500 font-medium mb-8">Free for anyone</p>
            <p className="text-slate-400 max-w-md mx-auto mb-10">
              Introduction to Forex and Trading.
            </p>
            <Link
              href="/auth/Register?package=1"
              className="inline-block bg-blue-500 hover:bg-emerald-400 text-slate-950 font-bold text-xl px-16 py-6 rounded-2xl transition-all"
            >
              Watch Beginner Level Tutorials
            </Link>
          </div>
          </div>

          {/* INTERMEDIATE - DIRECTIVE */}
          <div className="border border-dashed border-yellow-500/30 rounded-3xl p-12 text-center">
            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Intermediate Level</h2>
            <p className="text-yellow-500 font-medium mb-8">BRONZE • SILVER • GOLD PACKAGE REQUIRED</p>
            <p className="text-slate-400 max-w-md mx-auto mb-10">
              Master price action, support &amp; resistance, risk management and more.
            </p>
            <Link
              href="/auth/Register?package=2"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xl px-16 py-6 rounded-2xl transition-all"
            >
              Unlock Intermediate – View Packages
            </Link>
          </div>

          {/* EXPERT - DIRECTIVE */}
          <div className="border border-dashed border-violet-500/30 rounded-3xl p-12 text-center">
            <Crown className="w-12 h-12 text-violet-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Expert Level</h2>
            <p className="text-violet-500 font-medium mb-8">GOLD PACKAGE ONLY + 1 MONTH FREE SIGNALS</p>
            <p className="text-slate-400 max-w-md mx-auto mb-10">
              Smart Money Concepts, Institutional trading, Order Blocks &amp; advanced strategies.
            </p>
            <Link
              href="/auth/Register?package=3"
              className="inline-block bg-gradient-to-r from-violet-500 to-yellow-500 text-white font-bold text-xl px-16 py-6 rounded-2xl transition-all"
            >
              Unlock Expert – Get Gold Package
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 py-20 text-center border-t border-slate-800">
          <p className="text-slate-400">Need help choosing a package?</p>
          <Link href="/contacts" className="text-yellow-500 hover:text-yellow-400 font-medium">Contact Support →</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}