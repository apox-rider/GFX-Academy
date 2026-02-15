// src/components/home/PackagesSection.tsx
import Link from 'next/link';

interface Package {
  id: number;
  name: string;
  price: number;
  duration: string;
  features: string[];
  color: string;
}

interface Props { packages: Package[]; }

export default function PackagesSection({ packages }: Props) {
  return (
    <section id="packages" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-orbitron">Choose Your Path to Profit</h2>
          <p className="text-xl text-gray-600 mt-4">One-time, 2-month, or Lifetime access</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg) => (
            <article key={pkg.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:-translate-y-2 transition-all group">
              <div className={`h-2 bg-gradient-to-r ${pkg.color}`} />
              <div className="p-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-orbitron">{pkg.name}</h3>
                  <div>
                    <span className="text-5xl font-bold text-gray-900">TZS {pkg.price.toLocaleString()}</span>
                    <div className="text-sm text-gray-500">{pkg.duration}</div>
                  </div>
                </div>

                <ul className="mt-8 space-y-4" role="list">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      >
                        ✓
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/auth/register?package=${pkg.id}`}
                  className="mt-10 block w-full bg-black text-white text-center py-4 rounded-2xl font-semibold hover:bg-gray-900 transition focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  Enroll Now
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Responsive Comparison Table */}
        <div className="bg-white rounded-3xl shadow p-8">
          <h3 className="text-2xl font-semibold text-center mb-8">Quick Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max" role="table" aria-label="Package comparison table">
              <thead>
                <tr className="border-b">
                  <th className="py-4 pr-8">Feature</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="py-4 text-center">{pkg.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Price</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="text-center">{pkg.price.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 pr-8 font-medium">Duration</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="text-center">{pkg.duration}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 pr-8 font-medium">Full Mentorship</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="text-center">
                      {pkg.name === 'Bronze' ? '—' : pkg.name === 'Silver' ? '1 Month' : 'Lifetime'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}