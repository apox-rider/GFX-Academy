// src/components/common/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <nav
      className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-lg border-b border-gray-200"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-orbitron text-primary-700">GFX</span>
            <span className="text-xl font-inter text-gray-600">Academy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/about"
              className={`font-medium transition-colors ${
                router.pathname === '/about' ? 'text-primary-700' : 'text-gray-500 hover:text-primary-700'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`font-medium transition-colors ${
                router.pathname === '/contact' ? 'text-primary-700' : 'text-gray-500 hover:text-primary-700'
              }`}
            >
              Contact
            </Link>
            <Link
              href="/auth/register"
              className="bg-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Register
            </Link>
            <Link
              href="/auth/login"
              className="text-primary-700 font-semibold hover:underline"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobile}
            className="md:hidden p-2 text-gray-500 hover:text-primary-700"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-500 hover:text-primary-700 font-medium"
              onClick={toggleMobile}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-gray-500 hover:text-primary-700 font-medium"
              onClick={toggleMobile}
            >
              Contact
            </Link>
            <Link
              href="/auth/register"
              className="block px-3 py-2 bg-accent text-white text-center rounded-lg font-semibold mt-2"
              onClick={toggleMobile}
            >
              Register
            </Link>
            <Link
              href="/auth/login"
              className="block px-3 py-2 text-primary-700 font-semibold text-center"
              onClick={toggleMobile}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}