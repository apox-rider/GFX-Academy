'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await res.json();

      if (res.status === 404) {
        setError("No account found with this email address. Please check and try again.");
      } else if (!res.ok) {
        setError(result.message || "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Unable to connect to server. Please check your internet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-slate-950 text-slate-50 overflow-hidden min-h-screen flex items-center justify-center">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="relative max-w-md w-full mx-auto px-6 py-12 bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Forgot Password?</h1>
          <p className="text-slate-400 mt-3">
            Enter your registered email and we'll send you a reset link.
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">Reset Link Sent!</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We've sent a secure password reset link to:<br />
              <span className="font-medium text-yellow-400 break-all">{email}</span>
            </p>
            <p className="text-sm text-slate-500 mb-8">
              The link will expire in 30 minutes. Please check your inbox and spam folder.
            </p>
            <Link 
              href="/auth/login"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-10 py-4 rounded-2xl transition-all"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-4.5 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 transition"
                  placeholder="you@example.com"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Only emails associated with an existing account can reset password
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-900/60 border border-red-700 rounded-2xl flex items-start gap-3 text-red-300">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-600 disabled:cursor-not-allowed text-slate-950 font-bold text-lg py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            >
              {isLoading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-400 mt-8">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-yellow-500 hover:underline">
            Sign in here
          </Link>
        </p>

        <Link 
          href="/"
          className="flex items-center justify-center gap-2 mt-12 text-slate-500 hover:text-slate-400 transition text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </section>
  );
}