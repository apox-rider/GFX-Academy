// src/components/courses/Courses.tsx
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Header/page';
import Footer from '../components/Footer/page';

export default function Courses() {
  const courses = [
    { title: 'Beginner Forex Fundamentals', desc: 'Master the basics of currency trading, market analysis, and risk management through engaging video tutorials.', lessons: 12, duration: '6 hours', icon: '📚' },
    { title: 'Intermediate Technical Analysis', desc: 'Dive into chart patterns, indicators, and strategies with real-world examples in video format.', lessons: 15, duration: '8 hours', icon: '📊' },
    { title: 'Advanced Trading Strategies', desc: 'Learn expert-level techniques, including scalping, swing trading, and algorithmic approaches via in-depth videos.', lessons: 10, duration: '5 hours', icon: '🚀' },
  ];

  return (
    <>
    <Navbar/>
    <section className="relative bg-slate-950 text-slate-50 overflow-hidden border-b border-slate-800">
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/courses-bg.jpeg" // Replace with a suitable courses page background image, e.g., educational charts or videos
          alt="Courses Background"
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
       
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Forex Courses<br />Video Tutorials for Success
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Structured video courses from beginner to advanced levels, designed for Tanzanian traders. 
          <span className="block mt-2 text-slate-300 font-medium text-lg">
            Pay via M-Pesa, Tigo Pesa, or Airtel Money.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          >
            Enroll Now – Register Free
          </Link>
          <Link
            href="#course-list"
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all"
          >
            Browse Courses
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

      <section id="course-list" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Our Video Tutorial Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="text-4xl mb-4">{course.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-4">{course.desc}</p>
                <p className="text-sm text-slate-500 mb-4">
                  {course.lessons} Lessons • {course.duration}
                </p>
                <Link
                  href={`/courses/${i + 1}`} // Placeholder link to individual course page
                  className="inline-block bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-sm px-6 py-2 rounded-lg transition-all"
                >
                  Start Course
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Why Choose Our Courses?
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Our video tutorials are created by expert mentors who live off the markets. Access them anytime, anywhere, with progress tracking and community support.
          </p>
          <Link
            href="#packages"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg px-10 py-4 rounded-lg transition-all"
          >
            View Packages
          </Link>
        </div>
      </section>
    </section>
    <Footer/>
    </>
  );
}