// src/components/auth/Register.tsx
import { ArrowLeft, MoveLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Register() {
  return (
    <section className="relative bg-slate-950 text-slate-50 overflow-hidden min-h-screen flex items-center justify-center">
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/auth-bg.jpeg" // Replace with a suitable auth background image
          alt="Auth Background"
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="relative max-w-md w-full mx-auto px-6 py-12 bg-slate-900/50 border border-slate-800 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Sign Up</h1>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
              placeholder="Create a password"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
              placeholder="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          >
            Sign Up
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account? <Link href="/auth/login" className="text-yellow-500 hover:underline">Sign in</Link>
        </p>
        
        <a href='/' className="justify-center mt-8  text-slate-500 text-xs">
        <div className="justify-center  flex mt-8 text-center text-slate-500 text-xs">
          <ArrowLeft className='align-middle'/> <p className='text-lg'>Back to home</p>
        </div>
        </a>
      </div>
    </section>
  );
}