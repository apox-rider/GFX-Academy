// src/components/auth/Login.tsx
import { ArrowLeft, Home, MoveLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="relative max-w-md w-full mx-auto px-6 py-12 bg-slate-900/50 border border-slate-800 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Sign In</h1>
        
        <form className="space-y-6">
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
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-slate-700 rounded bg-slate-800" />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-300">Remember me</label>
            </div>
            <Link href="/auth/forgot-password" className="text-sm text-yellow-500 hover:underline">Forgot password?</Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          >
            Sign In
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-400 mt-6">
          Don&apos;t have an account? <Link href="/auth/Register" className="text-yellow-500 hover:underline">Sign up</Link>
        </p>
        
          <a href='/' className="justify-center mt-8  text-slate-500 text-xs">
        <div className="justify-center flex mt-8 text-center text-slate-500 text-xs">
          <ArrowLeft className='justify-center top-0  '/> <p className='text-lg'>Back to home</p>
        </div>
        </a>
      </div>
    </section>
  );
}