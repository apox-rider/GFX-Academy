'use client';

import Navbar from '../components/Header/page';
import Footer from '../components/Footer/page';
import Link from 'next/link';
import { useState } from 'react';
import { Unlock, Star, Crown, Play, FileText, X } from 'lucide-react';
import { FaUnlockAlt } from 'react-icons/fa';

interface Tutorial {
  id: number;
  title: string;
  type: 'video' | 'pdf';
  duration?: string;
  pages?: number;
  url: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export default function CoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: 'Introduction to Forex Trading',
      type: 'video',
      duration: '28 min',
      url: 'https://www.youtube.com/embed/dQw4w9wgxcq', // Replace with real URL
      level: 'Beginner',
    },
    {
      id: 2,
      title: 'Currency Pairs Explained',
      type: 'video',
      duration: '35 min',
      url: 'https://www.youtube.com/embed/VIDEO_ID_HERE',
      level: 'Beginner',
    },
    {
      id: 3,
      title: 'Forex Basics PDF Guide',
      type: 'pdf',
      pages: 48,
      url: 'https://example.com/forex-basics.pdf',
      level: 'Beginner',
    },
    {
      id: 4,
      title: 'Price Action Mastery',
      type: 'video',
      duration: '45 min',
      url: 'https://www.youtube.com/embed/another-video',
      level: 'Intermediate',
    },
  ];

  const beginnerTutorials = tutorials.filter(t => t.level === 'Beginner');
  const intermediateTutorials = tutorials.filter(t => t.level === 'Intermediate');
  const expertTutorials = tutorials.filter(t => t.level === 'Expert');

  const openPreview = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setIsModalOpen(true);
  };

  const isYouTube = (url: string) => 
    url.includes('youtube.com') || url.includes('youtu.be');

  return (
    <>
      <Navbar />
      <section className="relative bg-slate-950 text-slate-50 overflow-hidden">
        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Forex Courses &amp;<br />Video Tutorials
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto px-4">
            Start free with Beginner level.<br className="hidden sm:block" />
            Unlock Intermediate &amp; Expert with a package.
          </p>

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link
              href="/auth/Register"
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 sm:px-12 py-4 sm:py-5 rounded-2xl transition-all shadow-xl shadow-yellow-500/30 w-full sm:w-auto"
            >
              Start Free – Beginner Level
            </Link>
            <Link
              href="/Packages"
              className="border border-slate-700 hover:bg-slate-900 font-bold text-lg px-10 sm:px-12 py-4 sm:py-5 rounded-2xl transition-all w-full sm:w-auto"
            >
              View All Packages
            </Link>
          </div>
        </div>

        {/* Levels Section */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 pb-16 md:pb-24 space-y-16 md:space-y-24">
          
          {/* BEGINNER LEVEL */}
          <div>
            <div className="flex items-center gap-4 mb-8 md:mb-10">
              <Unlock className="w-8 h-8 text-emerald-500 flex-shrink-0" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Beginner Level</h2>
                <p className="text-yellow-600 font-medium uppercase tracking-widest text-sm sm:text-base">FREE FOR EVERYONE</p>
              </div>
            </div>

            <div className="border border-dashed border-yellow-500/30 rounded-3xl p-8 md:p-12 text-center mb-10 md:mb-12">
              <FaUnlockAlt className="w-10 h-10 md:w-12 md:h-12 text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Beginner Level</h2>
              <p className="text-emerald-500 font-medium mb-6 md:mb-8 text-base">Free for anyone</p>
              <p className="text-slate-400 max-w-md mx-auto mb-8 md:mb-10 text-base leading-relaxed">
                Introduction to Forex and Trading.
              </p>
              <Link
                href="/auth/Register?package=1"
                className="inline-block bg-blue-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg md:text-xl px-12 md:px-16 py-4 md:py-6 rounded-2xl transition-all w-full sm:w-auto"
              >
                Get Started Free
              </Link>
            </div>

            {/* Beginner Tutorials Grid - Better Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {beginnerTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all group"
                >
                  <div className="relative h-48 sm:h-52 bg-gradient-to-br from-slate-950 to-black flex items-center justify-center">
                    {tutorial.type === 'video' ? (
                      <>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-9 h-9 sm:w-12 sm:h-12 text-white" fill="currentColor" />
                        </div>
                        {tutorial.duration && (
                          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/90 px-3 py-1 text-xs rounded-full">
                            {tutorial.duration}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center">
                        <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-orange-400 mx-auto" />
                        {tutorial.pages && (
                          <p className="mt-3 text-sm text-slate-400">{tutorial.pages} pages</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="font-semibold text-base sm:text-lg leading-tight mb-5 line-clamp-2 min-h-[44px] sm:min-h-[56px]">
                      {tutorial.title}
                    </h3>
                    <button
                      onClick={() => openPreview(tutorial)}
                      className="w-full py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" /> Watch / Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INTERMEDIATE LEVEL */}
          <div>
            <div className="flex items-center gap-4 mb-8 md:mb-10">
              <Star className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Intermediate Level</h2>
                <p className="text-yellow-600 font-medium uppercase tracking-widest text-sm sm:text-base">BRONZE • SILVER • GOLD REQUIRED</p>
              </div>
            </div>

            <div className="border border-dashed border-yellow-500/30 rounded-3xl p-8 md:p-12 text-center mb-10 md:mb-12">
              <Star className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Intermediate Level</h2>
              <p className="text-yellow-500 font-medium mb-6 md:mb-8 text-base">BRONZE • SILVER • GOLD PACKAGE REQUIRED</p>
              <p className="text-slate-400 max-w-md mx-auto mb-8 md:mb-10 text-base leading-relaxed">
                Master price action, support &amp; resistance, risk management and more.
              </p>
              <Link
                href="/Packages"
                className="inline-block bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg md:text-xl px-12 md:px-16 py-4 md:py-6 rounded-2xl transition-all w-full sm:w-auto"
              >
                Unlock Intermediate
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 opacity-75 pointer-events-none">
              {intermediateTutorials.length > 0 ? (
                intermediateTutorials.map((tutorial) => (
                  <div key={tutorial.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center">
                    <p className="text-yellow-500 mb-3">🔒 {tutorial.title}</p>
                    <p className="text-sm text-slate-500">Requires package</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-slate-500">
                  Intermediate tutorials will appear here once unlocked
                </div>
              )}
            </div>
          </div>

          {/* EXPERT LEVEL */}
          <div>
            <div className="flex items-center gap-4 mb-8 md:mb-10">
              <Crown className="w-8 h-8 text-violet-500 flex-shrink-0" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Expert Level</h2>
                <p className="text-violet-600 font-medium uppercase tracking-widest text-sm sm:text-base">GOLD PACKAGE ONLY</p>
              </div>
            </div>

            <div className="border border-dashed border-violet-500/30 rounded-3xl p-8 md:p-12 text-center">
              <Crown className="w-10 h-10 md:w-12 md:h-12 text-violet-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Expert Level</h2>
              <p className="text-violet-500 font-medium mb-6 md:mb-8 text-base">GOLD PACKAGE ONLY + 1 MONTH FREE SIGNALS</p>
              <p className="text-slate-400 max-w-md mx-auto mb-8 md:mb-10 text-base leading-relaxed">
                Smart Money Concepts, Institutional trading, Order Blocks &amp; advanced strategies.
              </p>
              <Link
                href="/Packages"
                className="inline-block bg-gradient-to-r from-violet-500 to-yellow-500 text-white font-bold text-lg md:text-xl px-12 md:px-16 py-4 md:py-6 rounded-2xl transition-all w-full sm:w-auto"
              >
                Unlock Expert – Get Gold
              </Link>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-slate-900 py-16 md:py-20 text-center border-t border-slate-800">
          <p className="text-slate-400 text-base">Need help choosing a package?</p>
          <Link href="/contacts" className="text-yellow-500 hover:text-yellow-400 font-medium text-lg mt-2 inline-block">
            Contact Support →
          </Link>
        </div>
      </section>

      {/* Preview Modal - Mobile Optimized */}
      {isModalOpen && selectedTutorial && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-700">
              <h3 className="text-lg sm:text-2xl font-semibold pr-6 line-clamp-1">{selectedTutorial.title}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>

            <div className="p-4 sm:p-6 flex-1 overflow-auto">
              {selectedTutorial.type === 'video' ? (
                <div className="bg-black rounded-2xl overflow-hidden mb-6 shadow-2xl">
                  {isYouTube(selectedTutorial.url) ? (
                    <iframe
                      src={selectedTutorial.url}
                      className="w-full aspect-video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedTutorial.title}
                    />
                  ) : (
                    <video
                      controls
                      className="w-full aspect-video"
                      controlsList="nodownload"
                      preload="metadata"
                      aria-label={`Playing video: ${selectedTutorial.title}`}
                    >
                      <source src={selectedTutorial.url} type="video/mp4" />
                      <source src={selectedTutorial.url} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : (
                <div className="bg-slate-800 rounded-3xl p-10 sm:p-16 text-center">
                  <FileText className="w-20 h-20 sm:w-24 sm:h-24 text-orange-400 mx-auto mb-8" />
                  <h4 className="text-xl sm:text-2xl mb-3">PDF Document</h4>
                  {selectedTutorial.pages && (
                    <p className="text-slate-400 mb-10 text-base">{selectedTutorial.pages} pages</p>
                  )}
                  <a
                    href={selectedTutorial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-10 sm:px-12 py-4 sm:py-5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-2xl transition-all text-base sm:text-lg"
                  >
                    Open PDF in New Tab
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}