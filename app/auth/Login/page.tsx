'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function Login() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await login(email, password)

      if (!result.success) {
        setError(result.error || 'Invalid email or password')
        setIsLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative bg-slate-950 text-slate-50 overflow-hidden min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      
      <div className="flex absolute inset-0 opacity-20">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/011/635/825/small/abstract-square-interface-modern-background-concept-fingerprint-digital-scanning-visual-security-system-authentication-login-vector.jpg" 
          alt="Auth Background"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="relative max-w-md w-full mx-auto px-6 py-12 bg-slate-900/50 border border-slate-800 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Sign In</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
              placeholder="Enter your password"
              required
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
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] disabled:opacity-70"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-400 mt-6">
          Don&apos;t have an account? <Link href="/auth/register" className="text-yellow-500 hover:underline">Sign up</Link>
        </p>
        
        <Link href="/" className="flex items-center justify-center gap-2 mt-8 text-slate-500 hover:text-slate-400 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </section>
  )
}
