'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

const packageDetails: Record<number, { name: string; price: number; color: string; desc: string; tier: string }> = {
  1: { name: 'Bronze', price: 25000, color: 'from-blue-500 to-cyan-600', desc: 'Beginner friendly package', tier: 'bronze' },
  2: { name: 'Silver', price: 100000, color: 'from-purple-500 to-violet-600', desc: 'Intermediate level access', tier: 'silver' },
  3: { name: 'Gold', price: 130000, color: 'from-yellow-500 to-orange-600', desc: 'Full access + 1 month free signals', tier: 'gold' },
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register, isAuthenticated } = useAuth()
  const packageParam = searchParams.get('package')

  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  })

  const currentPkg = selectedPackage ? packageDetails[selectedPackage] : null

  useEffect(() => {
    if (packageParam) {
      const pkgId = parseInt(packageParam)
      if (pkgId >= 1 && pkgId <= 3) setSelectedPackage(pkgId)
    }
  }, [packageParam])

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        phone_number: formData.phone,
      })

      if (!result.success) {
        if (result.error?.includes('already exists')) {
          setError('An account with this email already exists. Would you like to login instead?')
        } else {
          setError(result.error || 'Registration failed. Please try again.')
        }
        setIsLoading(false)
        return
      }

      if (selectedPackage) {
        setSuccessMessage('Account created! Redirecting to payment...')
        setTimeout(() => {
          router.push(`/payment?package=${currentPkg?.tier}`)
        }, 1500)
      } else {
        setSuccessMessage('Account created successfully! Redirecting to dashboard...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (err) {
      setError('Something went wrong. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative bg-slate-950 text-slate-50 overflow-hidden min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://cdn1.expresscomputer.in/wp-content/uploads/2023/01/04170521/EC_Data_Security_Lock_750.jpg" 
          alt="Auth Background"  
          className="object-cover grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="relative max-w-md w-full mx-auto px-6 py-12 bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Sign Up</h1>
          <p className="text-slate-400 mt-2">Join thousands of successful Forex traders</p>
        </div>

        {currentPkg ? (
          <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-br ${currentPkg.color} text-black`}>
            <p className="uppercase text-xs tracking-widest opacity-75">Selected Package</p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <h2 className="text-3xl font-bold">{currentPkg.name}</h2>
                <p className="text-sm mt-1 opacity-90">{currentPkg.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{currentPkg.price.toLocaleString()}</p>
                <p className="text-xs">TZS</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <h2 className="text-2xl font-semibold">Free Account</h2>
            <p className="text-slate-400 text-sm mt-3">Access all Beginner courses + limited signals</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-2xl text-red-300 text-sm">
            {error}
            {error.includes('already exists') && (
              <div className="mt-3">
                <Link href="/auth/login" className="text-yellow-400 hover:underline font-medium">
                  → Go to Login
                </Link>
              </div>
            )}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-2xl text-green-300 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input 
              name="name" 
              type="text" 
              required 
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:border-yellow-500" 
              placeholder="John Mwangi" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number (M-Pesa)</label>
            <input 
              name="phone" 
              type="tel" 
              required 
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:border-yellow-500" 
              placeholder="+255 712 345 678" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:border-yellow-500" 
              placeholder="john@example.com" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              minLength={6}
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:border-yellow-500" 
              placeholder="Create password" 
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold text-lg py-4 rounded-2xl transition-all ${currentPkg ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black' : 'bg-yellow-500 text-black'} hover:scale-105 disabled:opacity-70`}
          >
            {isLoading 
              ? 'Processing...' 
              : currentPkg 
                ? `Pay ${currentPkg.price.toLocaleString()} TZS & Create Account` 
                : 'Create Free Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-yellow-500 hover:underline">Sign in here</Link>
        </p>

        <Link href="/" className="flex items-center justify-center gap-2 mt-10 text-slate-500 hover:text-slate-400 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </section>
  )
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
