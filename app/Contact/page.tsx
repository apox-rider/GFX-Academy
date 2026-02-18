// app/contact/page.tsx
'use client';

import Link from 'next/link';
import { LocateFixed, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Header/page';
import Footer from '../components/Footer/page';

export default function ContactPage() {
  const contactMethods = [
    {
      title: 'Email Us',
      desc: 'Reach out via email for inquiries or support.',
      icon: <Mail />,
      details: 'meshackaidai3@gmail.com',
    },
    {
      title: 'Call Us',
      desc: 'Speak directly with our team during business hours.',
      icon: <Phone />,
      details: '+255 123 456 789',
    },
    {
      title: 'Visit Us',
      desc: 'Come to our office in Mbeya.',
      icon: <LocateFixed />,
      details: 'MUST, Mbeya, Tanzania',
    },
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate sending (replace with real logic later)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    console.log('Form data:', formData);

    // For real email → use Server Action, Resend, EmailJS, formsubmit.co, etc.
    // Example with formsubmit.co (uncomment if you want quick no-backend solution):
    // You can switch to <form action="https://formsubmit.co/meshackaidai3@gmail.com" method="POST"> and remove this handler

    setStatus('success');
    setFormData({ name: '', email: '', message: '' }); // reset

    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <>
      <Navbar />

      <section className="relative bg-slate-950 text-slate-50 overflow-hidden border-b border-slate-800 min-h-screen">
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Contact Us<br />We're Here to Help
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Get in touch for questions about our courses, signals, mentorship, or payments.
            <span className="block mt-2 text-slate-300 font-medium text-lg">
              We support M-Pesa, Tigo Pesa, and Airtel Money.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/Register"
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            >
              Start Free – Register Now
            </Link>
            <Link
              href="#contact-form"
              className="w-full sm:w-auto bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all"
            >
              Send Message
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-slate-500 grayscale opacity-70">
            <span className="text-xs font-semibold tracking-widest uppercase">
              Integration Partners:
            </span>
            <span className="text-sm font-medium">M-Pesa</span>
            <span className="text-sm font-medium">Tigo Pesa</span>
            <span className="text-sm font-medium">Airtel Money</span>
          </div>
        </div>

        {/* Contact Methods */}
        <div id="contact-methods" className="py-16 bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Ways to Contact Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactMethods.map((method, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-2">{method.desc}</p>
                  <p className="text-slate-300 font-medium">{method.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* The Form Section – now with id for smooth scroll */}
        <div id="contact-form" className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Send Us a Message
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Fill out the form below, and our team will get back to you within 24 hours.
            </p>

            <form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto space-y-6"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all resize-y"
              />

              <button
                type="submit"
                disabled={status === 'sending'}
                className={`w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {status === 'sending'
                  ? 'Sending...'
                  : status === 'success'
                  ? 'Message Sent!'
                  : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="text-green-400 text-center mt-4">
                  Thank you! We'll get back to you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      

      <Footer />
    </>
  );
}