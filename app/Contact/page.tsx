// src/components/contact/Contact.tsx
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Header/page';
import Footer from '../components/Footer/page';

export default function Contact() {
  const contactMethods = [
    { title: 'Email Us', desc: 'Reach out via email for inquiries or support.', icon: '📧', details: 'support@forexmaster.co.tz' },
    { title: 'Call Us', desc: 'Speak directly with our team during business hours.', icon: '📞', details: '+255 123 456 789' },
    { title: 'Visit Us', desc: 'Come to our office in Dar es Salaam.', icon: '📍', details: '123 Forex Street, Dar es Salaam, Tanzania' },
  ];

  return (
    <>
    <Navbar/>
    <section className="relative bg-slate-950 text-slate-50 overflow-hidden border-b border-slate-800">
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/contact-bg.jpeg" // Replace with a suitable contact page background image
          alt="Contact Background"
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-slate-400">
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
            href="/auth/register"
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          >
            Start Free – Register Now
          </Link>
          <Link
            href="#contact-methods"
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all"
          >
            Get in Touch
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-slate-500 grayscale opacity-70">
          <span className="text-xs font-semibold tracking-widest uppercase">Integration Partners:</span>
          {/* Add small logos for M-Pesa / Tigo here */}
          <span className="text-sm font-medium">M-Pesa</span>
          <span className="text-sm font-medium">Tigo Pesa</span>
          <span className="text-sm font-medium">Airtel Money</span>
        </div>
      </div>

      <section id="contact-methods" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Ways to Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-2">{method.desc}</p>
                <p className="text-slate-300 font-medium">{method.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Send Us a Message
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Fill out the form below, and our team will get back to you within 24 hours.
          </p>
          {/* Simple contact form placeholder */}
          <form className="max-w-xl mx-auto space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </section>
    <Footer/>
    </>
  );
}