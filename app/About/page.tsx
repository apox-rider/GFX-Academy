import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Header/page'; // Adjust path if needed
import Footer from '../components/Footer/page';
import { Trade_Winds } from 'next/font/google';
import { GoGraph } from 'react-icons/go';
import { CardSim, Group } from 'lucide-react';
import { CgCommunity } from 'react-icons/cg';
import { RiUserCommunityFill } from 'react-icons/ri';
import { MdPayments } from 'react-icons/md';

export default function About() {
  const features = [
    {  
      title: 'Live Trading Signals',
      desc: 'Daily high-probability Buy/Sell alerts delivered to your dashboard and Telegram with clear entry, stop-loss & take-profit levels.',
      icon: <GoGraph/>,
    },
    {
      title: 'Tanzania-Friendly Payments',
      desc: 'Instant access using M-Pesa, Tigo Pesa, or Airtel Money — no international cards required.',
      icon: <MdPayments/>,
    },
    { 
      title: 'Expert Mentorship & Community',
      desc: 'Weekly live Zoom sessions, one-on-one guidance, and a supportive community of active Tanzanian traders.',
      icon:<RiUserCommunityFill/>
      ,
    }, 
  ]; 

  const supportTeams = [
    {
      name: 'Education & Content Team',
      role: 'Course Creators & Instructors',
      desc: 'Experts who create structured courses, video tutorials, and practical guides to make learning forex simple and effective.',
    },
    { 
      name: 'Signals & Analysis Team',
      role: 'Market Analysts',
      desc: 'Professional traders who monitor the markets, deliver real-time signals, and provide trade explanations for subscribers.',
    },
    { 
      name: 'Support & Operations Team',
      role: 'Member Success',
      desc: 'Ensuring smooth payments, subscription management, and quick responses to subscriber queries.',
    },
  ]; 

  return (
    <>
      <Navbar />

      <main className="bg-slate-950 text-slate-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

          <div className="flex justify-center absolute inset-0 opacity-25">
            <img
              src="WhatsApp Image 2026-02-15 at 15.59.02.jpeg"
              alt="GalileeFx Academy Background"
              className="object-cover grayscale-[0.7] brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 pt-40 pb-32 text-center md:pt-48">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-400">
              Welcome to GalileeFx Academy – Your Gateway to Professional Forex Trading.
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-10 leading-relaxed font-light">
              At GalileeFx Academy, we believe that trading is not just about numbers—it’s about knowledge, discipline, and strategy. We are dedicated to providing premium education, professional trading signals, and mentorship to traders at every level, from beginners to advanced.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="/auth/Register"
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-slate-950 font-bold text-lg px-12 py-5 rounded-xl transition-all shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 transform hover:-translate-y-1"
              >
                Join GalileeFx Academy Today and Trade Like a Pro!
              </Link>

              <Link
                href="#founder"
                className="w-full sm:w-auto bg-slate-800/70 border border-slate-600 hover:bg-slate-700 hover:border-slate-500 text-white font-medium text-lg px-10 py-5 rounded-xl transition-all"
              >
                Meet the Founder
              </Link>
            </div>
          </div>
        </section>

        {/* Founder and Team Section */}
        <section id="founder" className="py-20 bg-slate-950">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">Meet the Team Behind GalileeFx Academy</h2>

            <div className="max-w-4xl mx-auto mb-12">
              <div className="p-10 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-yellow-600/30 hover:border-yellow-500/50 transition-all duration-300 shadow-xl shadow-black/40">
                <div className="text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                    <div className=" inset-0 opacity-20">
                      <img
                        src="unnamed (2).jpg" 
                        alt="Contact Background"
                        className="rounded-full"
                      />
                      <div className="from-slate-950 via-transparent to-slate-950"></div>
                    </div>    
                    Meshack Jeremiah Aidan
                  </h3>
                  <p className="text-2xl text-yellow-400 font-semibold mb-2">Founder of GalileeFx Academy</p>
                  <p className="text-lg text-slate-300 mb-6">Born-again Christian | Biomedical Equipment Engineer | Expert in Market Analysis & Strategy Development for Consistent Trading Performance</p>
                  <p className="text-xl text-slate-200 leading-relaxed">
                    Meshack Jeremiah Aidan – Founder & Lead Trader: Passionate about empowering traders, Meshack brings years of forex trading experience and a track record of profitable strategies.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportTeams.map((team, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-700/30"
                >
                  <h3 className="text-2xl font-bold text-white mb-3">{team.name}</h3>
                  <p className="text-yellow-500 font-medium mb-4">{team.role}</p>
                  <p className="text-slate-300 leading-relaxed">{team.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white">Our Mission</h2>
            <p className="text-2xl md:text-3xl text-slate-200 font-medium italic max-w-4xl mx-auto leading-relaxed">
              “Empower every trader with the skills and confidence to succeed in the forex market.”
            </p>
            <p className="text-xl text-slate-400 mt-8 max-w-3xl mx-auto">
              At GalileeFx Academy, we combine education, technology, and expert support to ensure that every subscriber can trade smarter and safer. Whether you’re starting your forex journey or aiming to refine your strategy, our team is here to guide you every step of the way.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-slate-900/70">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="p-10 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-900/20 text-center"
                >
                  <div className="text-6xl mb-6 opacity-90">{f.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950 text-center border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Ready to Start Your Forex Journey with Confidence?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
              Join hundreds of Tanzanian traders who are learning, earning, and growing with GalileeFx Academy.
            </p>

            <Link
              href="/auth/Register"
              className="inline-block bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-xl px-16 py-6 rounded-xl transition-all shadow-2xl shadow-yellow-600/30 hover:shadow-yellow-500/50 transform hover:-translate-y-2"
            >
              Join GalileeFx Academy Today and Trade Like a Pro!
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}