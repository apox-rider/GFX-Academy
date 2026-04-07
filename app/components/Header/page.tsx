'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, TrendingUp, User } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const getLinkClass = (href: string, isMobile = false) => {
    const baseClass = isMobile 
      ? 'block text-lg font-medium px-2' 
      : 'text-sm font-medium transition-colors';
    const activeClass = isMobile ? 'text-yellow font-bold' : 'text-white font-semibold px-3 py-2 text-sm font-medium border-b-4  ';
    const inactiveClass = isMobile 
      ? 'text-slate-300 hover:text-white' 
      : 'text-slate-300 hover:text-white';

    return `${baseClass} ${pathname === href ? activeClass : inactiveClass}`;
  };

  if (isLoading) {
    return (
      <nav className="bg-slate-950 sticky top-0 z-50 border-b border-slate-800/60">
        <div className="md:max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-yellow-500 p-1.5 rounded-lg group-hover:rotate-3 transition-transform">
                <TrendingUp size={24} className="text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tighter text-white leading-none">
                  GALILEE<span className="text-yellow-500">FX</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="bg-slate-950 sticky top-0 z-50 border-b border-slate-800/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="md:max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-yellow-500 p-1.5 rounded-lg group-hover:rotate-3 transition-transform">
              <TrendingUp size={24} className="text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter text-white leading-none">
                GALILEE<span className="text-yellow-500">FX</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium leading-none mt-1">
                Academy
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={getLinkClass('/')}>
              Home
            </Link>
            <Link href="/Courses" className={getLinkClass('/Courses')}>
              Courses
            </Link>
            <Link href="/Signals" className={getLinkClass('/Signals')}>
              Signals
            </Link>
            <Link href="/About" className={getLinkClass('/About')}>
              About
            </Link>
            <Link href="/Contact" className={getLinkClass('/Contact')}>
              Contact
            </Link>
            <div className="h-4 w-px bg-slate-800 mx-2"></div>
            {isAuthenticated ? (
              <Link href="/Profile" className={getLinkClass('/Profile')}>
                <div className="flex items-center gap-2 bg-yellow-500 px-3 py-2 rounded-lg">
                  <User size={18} className="text-slate-950" />
                  <span className="text-slate-950 font-medium text-sm">Profile</span>
                </div>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-slate-300 hover:text-yellow-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-yellow-500 text-slate-950 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/10 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={toggleMobile}
        className="md:hidden absolute right-4 top-6 p-2 text-slate-400 hover:text-white transition-colors"
        aria-label="Toggle mobile menu"
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div 
        className={`md:hidden absolute w-full bg-slate-900 border-b border-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-4 pb-8 space-y-4">
          <Link href="/" className={getLinkClass('/', true)} onClick={toggleMobile}>
            Home
          </Link>
          <Link href="/Courses" className={getLinkClass('/Courses', true)} onClick={toggleMobile}>
            Courses
          </Link>
          <Link href="/Signals" className={getLinkClass('/Signals', true)} onClick={toggleMobile}>
            Signals
          </Link>
          <Link href="/About" className={getLinkClass('/About', true)} onClick={toggleMobile}>
            About
          </Link>
          <Link href="/Contact" className={getLinkClass('/Contact', true)} onClick={toggleMobile}>
            Contact
          </Link>
          <hr className="border-slate-800 my-4" />
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <Link
                href="/Profile"
                className="w-full text-center py-3 text-slate-300 font-semibold border border-slate-700 rounded-xl"
                onClick={toggleMobile}
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="w-full text-center py-3 text-slate-300 font-semibold border border-slate-700 rounded-xl"
                  onClick={toggleMobile}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="w-full text-center py-3 bg-yellow-500 text-slate-950 font-bold rounded-xl"
                  onClick={toggleMobile}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
