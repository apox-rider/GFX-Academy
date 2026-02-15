// src/components/home/TestimonialsSection.tsx
import { Star, BadgeCheck, Quote } from 'lucide-react';

const testimonials = [
  { 
    name: 'Juma M.', 
    role: 'Dar es Salaam', 
    quote: 'From losing trades to consistent profit in 3 weeks. The Gold package signals are worth every shilling!',
    package: 'Gold Member'
  },
  { 
    name: 'Aisha K.', 
    role: 'Arusha', 
    quote: 'The signals are spot on. I already recovered my Silver enrollment fee within the first month of trading.',
    package: 'Silver Member'
  },
  { 
    name: 'Peter S.', 
    role: 'Mbeya', 
    quote: 'Best investment I’ve made in my financial life. The lifetime mentorship changed how I see the charts.',
    package: 'Lifetime Gold'
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-950" aria-label="Student testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Success Stories
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Join hundreds of Tanzanian traders who have moved from gambling to professional trading.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8" role="list">
          {testimonials.map((t, i) => (
            <blockquote 
              key={i} 
              className="relative bg-slate-900/40 border border-slate-800 p-8 rounded-3xl flex flex-col hover:border-slate-700 transition-colors" 
              role="listitem"
            >
              {/* Quote Icon Decoration */}
              <Quote className="absolute top-6 right-8 text-slate-800 w-10 h-10 -z-0" />
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <p className="text-slate-300 text-lg leading-relaxed italic mb-8">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-yellow-500 font-bold text-xl">
                    {t.name.charAt(0)}
                  </div>
                  <cite className="not-italic">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      {t.name}
                      <BadgeCheck size={16} className="text-blue-400" />
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">
                      {t.role} • <span className="text-yellow-500/80">{t.package}</span>
                    </div>
                  </cite>
                </div>
              </div>
            </blockquote>
          ))}
        </div>

        {/* Local Trust Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-slate-900/20 border border-slate-800/50 rounded-2xl">
            <p className="text-slate-500 text-sm">
              <span className="text-white font-semibold">4.9/5 Average Rating</span> across our student community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}