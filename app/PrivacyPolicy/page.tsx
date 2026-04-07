import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-slate max-w-none space-y-6">
          <p className="text-slate-400">Last updated: April 7, 2026</p>

          <h2 className="text-2xl font-bold text-white mt-8">1. Information We Collect</h2>
          <p className="text-slate-300">
            We collect information you provide directly to us, such as when you create an account, 
            subscribe to our services, fill out a form, or communicate with us. This may include:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2">
            <li>Name and contact information (email, phone number)</li>
            <li>Payment information (processed securely via ClickPesa)</li>
            <li>Trading preferences and profile information</li>
            <li>Communications and feedback</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">2. How We Use Your Information</h2>
          <p className="text-slate-300">We use the information we collect to:</p>
          <ul className="list-disc list-inside text-slate-300 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">3. Information Sharing</h2>
          <p className="text-slate-300">
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except as described in this policy.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">4. Data Security</h2>
          <p className="text-slate-300">
            We implement appropriate security measures to protect your personal information. 
            Payment processing is handled securely by ClickPesa.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">5. Contact Us</h2>
          <p className="text-slate-300">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:meshackaidan3@gmail.com" className="text-yellow-500 hover:underline">
              meshackaidan3@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
