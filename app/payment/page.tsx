'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Loader2, Smartphone } from 'lucide-react'

const PACKAGES = {
  bronze: { name: 'Bronze', price: 25000, color: 'from-blue-500 to-cyan-600', features: ['Basic Forex Course', 'Limited Signals', 'Email Support'] },
  silver: { name: 'Silver', price: 100000, color: 'from-purple-500 to-violet-600', features: ['Intermediate Course', 'Daily Signals', 'Priority Support', 'Trading Strategies'] },
  gold: { name: 'Gold', price: 130000, color: 'from-yellow-500 to-orange-600', features: ['Full Course Access', 'Premium Signals', '1-on-1 Mentorship', 'Advanced Strategies', 'Weekly Webinars'] },
}

const PAYMENT_METHODS = [
  { id: 'mpesa', name: 'M-Pesa', icon: '📱' },
  { id: 'tigo_pesa', name: 'Tigo Pesa', icon: '📱' },
  { id: 'airtel_money', name: 'Airtel Money', icon: '📱' },
  { id: 'halopesa', name: 'HaloPesa', icon: '📱' },
]

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageParam = searchParams.get('package') as keyof typeof PACKAGES | null
  const userIdParam = searchParams.get('user_id')
  const orderParam = searchParams.get('order')

  const [step, setStep] = useState<'select' | 'payment' | 'processing' | 'success' | 'failed'>('select')
  const [selectedPackage, setSelectedPackage] = useState<string | null>(packageParam || null)
  const [selectedMethod, setSelectedMethod] = useState<string>('mpesa')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderReference, setOrderReference] = useState(orderParam || '')
  const [user, setUser] = useState<{ id: string; email: string; phone_number: string } | null>(null)

  useEffect(() => {
    const initUser = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()

        if (data.authenticated && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            phone_number: data.user.phone_number || '',
          })
          if (data.user.phone_number) {
            setPhoneNumber(data.user.phone_number)
          }
        }
      } catch (err) {
        console.error('Error fetching session:', err)
      }
    }

    initUser()
  }, [userIdParam])

  useEffect(() => {
    if (!orderReference) return

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payments/status?order_reference=${orderReference}`)
        const data = await response.json()

        if (data.success && data.payment) {
          if (data.payment.payment_status === 'completed') {
            setStep('success')
          } else if (data.payment.payment_status === 'failed') {
            setStep('failed')
          }
        }
      } catch (err) {
        console.error('Error checking payment status:', err)
      }
    }

    if (step === 'processing') {
      const interval = setInterval(checkPaymentStatus, 5000)
      return () => clearInterval(interval)
    }
  }, [orderReference, step])

  useEffect(() => {
    if (step !== 'processing' || !orderReference) return

    const TIMEOUT_DURATION = 60000 // 1 minute

    const timeoutId = setTimeout(async () => {
      // Check current payment status before cancelling
      try {
        const response = await fetch(`/api/payments/status?order_reference=${orderReference}`)
        const data = await response.json()

        if (data.success && data.payment && data.payment.payment_status === 'pending') {
          // Payment still pending after 1 minute - cancel it
          console.log('Payment timeout - cancelling payment')

          await fetch('/api/payments/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_id: data.payment.id }),
          })

          setError('Payment request timed out. Please try again.')
          setStep('failed')
        }
      } catch (err) {
        console.error('Error handling payment timeout:', err)
        setError('Payment request timed out. Please try again.')
        setStep('failed')
      }
    }, TIMEOUT_DURATION)

    return () => clearTimeout(timeoutId)
  }, [step, orderReference])

  const handleSelectPackage = (pkg: string) => {
    setSelectedPackage(pkg)
    setStep('payment')
  }

  const handleInitiatePayment = async () => {
    if (!user) {
      setError('Please log in to make a payment')
      return
    }

    if (!selectedPackage || !phoneNumber) {
      setError('Please select a package and enter phone number')
      return
    }

    if (!phoneNumber.match(/^(\+255|0)[0-9]{9}$/)) {
      setError('Please enter a valid Tanzanian phone number (e.g., 0712345678 or +255712345678)')
      return
    }

    setIsLoading(true)
    setError('')

    console.log('Initiating payment:', { user_id: user.id, package: selectedPackage, phone: phoneNumber, method: selectedMethod })

    try {
      console.log('Sending request to /api/payments/initiate')
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          package_tier: selectedPackage,
          payment_method: selectedMethod,
          customer_email: user.email,
          customer_phone: phoneNumber,
        }),
      })

      const data = await response.json()

      console.log('Response status:', response.status)
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment')
      }

      setOrderReference(data.payment.order_reference)
      setStep('processing')
    } catch (err) {
      console.error('Payment error:', err)
      setError(err instanceof Error ? err.message : 'Failed to initiate payment')
      setStep('failed')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhone = (value: string) => {
    let phone = value.replace(/[^0-9]/g, '')
    if (phone.startsWith('255') && phone.length > 3) {
      phone = '0' + phone.substring(3)
    }
    if (phone.startsWith('0') && phone.length > 10) {
      phone = '+255' + phone.substring(1)
    }
    return phone
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <h1 className="text-4xl font-bold text-center mb-4">Complete Your Payment</h1>
        <p className="text-slate-400 text-center mb-12">Secure payment powered by ClickPesa</p>

        {/* Package Selection */}
        {step === 'select' && (
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(PACKAGES).map(([key, pkg]) => (
              <div 
                key={key}
                className={`bg-gradient-to-br ${pkg.color} p-1 rounded-3xl cursor-pointer transform hover:scale-105 transition`}
                onClick={() => handleSelectPackage(key)}
              >
                <div className="bg-slate-900 rounded-3xl p-8 h-full">
                  <h3 className="text-2xl font-bold">{pkg.name}</h3>
                  <p className="text-4xl font-bold mt-4">{pkg.price.toLocaleString()}</p>
                  <p className="text-slate-400">TZS/month</p>
                  <ul className="mt-6 space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-8 py-3 bg-white text-black font-bold rounded-xl">
                    Select {pkg.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Form */}
        {step === 'payment' && selectedPackage && (
          <div className="max-w-xl mx-auto">
            <div className={`bg-gradient-to-br ${PACKAGES[selectedPackage as keyof typeof PACKAGES].color} p-1 rounded-3xl mb-8`}>
              <div className="bg-slate-900 rounded-3xl p-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-slate-400 text-sm">Selected Package</p>
                    <h3 className="text-3xl font-bold mt-1">{PACKAGES[selectedPackage as keyof typeof PACKAGES].name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold">{PACKAGES[selectedPackage as keyof typeof PACKAGES].price.toLocaleString()}</p>
                    <p className="text-slate-400">TZS</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                      selectedMethod === method.id 
                        ? 'border-yellow-500 bg-yellow-500/10' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span>{method.name}</span>
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number ({PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name})
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
                    placeholder="0712345678 or +255712345678"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl focus:border-yellow-500"
                  />
                </div>
                <p className="text-slate-500 text-sm mt-2">
                  You will receive a payment prompt on this number
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-300">
                  {error}
                </div>
              )}

              <button
                onClick={handleInitiatePayment}
                disabled={isLoading || !phoneNumber}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  `Pay ${PACKAGES[selectedPackage as keyof typeof PACKAGES].price.toLocaleString()} TZS`
                )}
              </button>
            </div>
          </div>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Processing Payment</h2>
              <p className="text-slate-400 mb-4">
                Please check your phone and enter your PIN to complete the payment.
              </p>
              <p className="text-sm text-slate-500">
                Order: <span className="font-mono">{orderReference}</span>
              </p>
              <div className="mt-8 animate-pulse">
                <p className="text-yellow-500">Waiting for payment confirmation...</p>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-slate-900 border border-green-500/30 rounded-3xl p-12">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-green-400">Payment Successful!</h2>
              <p className="text-slate-400 mb-8">
                Your {PACKAGES[selectedPackage as keyof typeof PACKAGES]?.name} subscription is now active.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Failed */}
        {step === 'failed' && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-12">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-red-400">Payment Failed</h2>
              <p className="text-slate-400 mb-8">
                {error || 'The payment could not be completed. Please try again.'}
              </p>
              <button
                onClick={() => setStep(selectedPackage ? 'payment' : 'select')}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}
