// src/components/home/TestimonialsSection.tsx
import Link from 'next/link';

const testimonials = [
  { name: 'Juma M.', role: 'Dar es Salaam', quote: 'From losing trades to consistent profit in 3 weeks. Gold package is worth every shilling!' },
  { name: 'Aisha K.', role: 'Arusha', quote: 'The signals are spot on. Already recovered my Silver fee in one month.' },
  { name: 'Peter S.', role: 'Mbeya', quote: 'Best investment I’ve made. Lifetime Gold + mentorship changed my life.' },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white" aria-label="Student testimonials">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-orbitron text-center mb-12">What Our Students Say</h2>
        <div className="grid md:grid-cols-3 gap-8" role="list">
          {testimonials.map((t, i) => (
            <blockquote key={i} className="bg-gray-50 p-8 rounded-3xl" role="listitem">
              <p className="text-lg italic mb-6">"{t.quote}"</p>
              <cite className="not-italic">
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}