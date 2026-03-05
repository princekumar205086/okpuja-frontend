/**
 * OKPUJA - Puja Services Landing Page
 * Route: /puja
 * 
 * Main entry point for all puja services with city-wise and service-wise navigation
 * Optimized for SEO with focus on Bihar markets (Purnia, Katihar, Araria, etc.)
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { INDIA_CITIES, PUJA_SERVICES } from '@/lib/seo/keywords';
import { SITE_CONFIG } from '@/lib/seo/seoConfig';
import { SchemaScript } from '@/lib/seo/SchemaScript';
import { buildBreadcrumbSchema, buildFAQSchema } from '@/lib/seo/schema';

// ============================================================
// METADATA
// ============================================================
export const metadata: Metadata = {
  title: 'Book Pandit for Puja Online | 100+ Puja Services | Purnia, Bihar & All India',
  description:
    'Book verified pandits for puja, havan, and religious ceremonies online. 100+ puja services including Satyanarayan Puja, Griha Pravesh, Ganesh Puja. Serving Purnia, Katihar, Araria, Bhagalpur, Madhepura, Kishanganj, Saharsa & all India.',
  keywords: [
    'book pandit online',
    'puja booking india',
    'online puja services',
    'pandit for puja near me',
    'pandit in purnia',
    'puja service in purnia bihar',
    'book pandit katihar',
    'pandit araria',
    'puja bhagalpur',
    'havan booking online',
    'best pandit india',
    'satyanarayan puja booking',
    'griha pravesh puja',
    'ganesh puja at home',
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/puja`,
  },
  openGraph: {
    title: 'Book Pandit for Puja Online | OKPUJA',
    description:
      'Book verified pandits for 100+ puja services. Trusted in Purnia, Bihar & across India.',
    url: `${SITE_CONFIG.url}/puja`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

// Bihar priority cities for special SEO
const BIHAR_PRIORITY_CITIES = [
  { name: 'Purnia', slug: 'purnia', description: 'Book trusted pandits in Purnia, Bihar 854301' },
  { name: 'Katihar', slug: 'katihar', description: 'Professional puja services in Katihar' },
  { name: 'Araria', slug: 'araria', description: 'Experienced pandits for all pujas in Araria' },
  { name: 'Bhagalpur', slug: 'bhagalpur', description: 'Book pandit for havan in Bhagalpur' },
  { name: 'Madhepura', slug: 'madhepura', description: 'Puja booking made easy in Madhepura' },
  { name: 'Kishanganj', slug: 'kishanganj', description: 'Reliable pandit services in Kishanganj' },
  { name: 'Saharsa', slug: 'saharsa', description: 'Traditional puja services in Saharsa' },
  { name: 'Patna', slug: 'patna', description: 'Premium pandit booking in Patna' },
];

// FAQs for SEO
const PAGE_FAQS = [
  {
    question: 'How do I book a pandit for puja in Purnia?',
    answer:
      'Visit OKPUJA.com, select your puja type, choose Purnia as your city, pick your preferred date and time, and complete the booking. Our verified pandits will arrive at your doorstep.',
  },
  {
    question: 'What puja services are available in Bihar?',
    answer:
      'We offer 100+ puja services in Bihar including Satyanarayan Puja, Griha Pravesh, Ganesh Puja, Lakshmi Puja, Navgraha Shanti, Havan, Wedding Puja, Mundan, and all festival pujas.',
  },
  {
    question: 'What is the cost of puja booking in Purnia?',
    answer:
      'Puja prices start from ₹1,100 and vary based on the type of puja and samagri required. All prices are transparent with no hidden charges.',
  },
  {
    question: 'Do you provide puja samagri?',
    answer:
      'Yes, we provide complete puja samagri kits with all bookings. You can also choose to arrange your own samagri if preferred.',
  },
  {
    question: 'Are your pandits verified?',
    answer:
      'All our pandits are verified with background checks, vedic education verification, and customer reviews. We ensure authentic and professional service.',
  },
];

export default function PujaPage() {
  const popularPujas = PUJA_SERVICES.filter((p) => p.category === 'popular').slice(0, 12);
  const festivalPujas = PUJA_SERVICES.filter((p) => p.category === 'festival').slice(0, 8);
  const havanPujas = PUJA_SERVICES.filter((p) => p.category === 'havan').slice(0, 6);
  const lifeEventPujas = PUJA_SERVICES.filter((p) => p.category === 'life-events').slice(0, 8);
  const metroCities = INDIA_CITIES.filter((c) => c.tier === 1).slice(0, 8);

  // Build schemas (LocalBusiness is already in global layout)
  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Puja Services', url: '/puja' },
    ]),
    buildFAQSchema(PAGE_FAQS),
  ];

  return (
    <>
      <SchemaScript schemas={schemas} />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 py-16 px-4">
          <div className="max-w-6xl mx-auto text-center text-white">
            <nav className="text-sm text-orange-100 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center justify-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white font-medium">Puja Services</li>
              </ol>
            </nav>

            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Book Pandit for Puja Online
            </h1>
            <p className="text-lg md:text-xl text-orange-100 max-w-3xl mx-auto mb-8">
              100+ verified pandits for Satyanarayan Puja, Griha Pravesh, Ganesh Puja &amp; more.
              Serving Purnia, Katihar, Araria &amp; all of India.
            </p>

            {/* Quick Search Cities */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {BIHAR_PRIORITY_CITIES.slice(0, 6).map((city) => (
                <Link
                  key={city.slug}
                  href={`/puja/${city.slug}`}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {city.name}
                </Link>
              ))}
            </div>

            <Link
              href="/pujaservice"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Browse All Pujas
            </Link>
          </div>
        </section>

        {/* Bihar Special Section */}
        <section className="py-12 px-4 bg-gradient-to-r from-orange-100 to-amber-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
              Puja Services in Bihar
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Trusted pandit booking in Purnia, Katihar, Araria, Bhagalpur &amp; nearby areas
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BIHAR_PRIORITY_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/puja/${city.slug}`}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
                >
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    Puja in {city.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{city.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Pujas */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Popular Puja Services</h2>
            <p className="text-gray-600 mb-8">Most booked puja services across India</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/pujaservice`}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {puja.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{puja.hindi}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Festival Pujas */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Festival Pujas</h2>
            <p className="text-gray-600 mb-8">Book pandit for upcoming festivals</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {festivalPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/pujaservice`}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {puja.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{puja.hindi}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Havan Services */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Havan &amp; Yagna Services</h2>
            <p className="text-gray-600 mb-8">Sacred fire rituals with experienced pandits</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {havanPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/pujaservice`}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {puja.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{puja.hindi}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Life Events */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Life Event Pujas</h2>
            <p className="text-gray-600 mb-8">Sanskar and ceremonies for life&apos;s special moments</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {lifeEventPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/pujaservice`}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {puja.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{puja.hindi}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Metro Cities */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Puja Services in Major Cities
            </h2>
            <p className="text-gray-600 mb-8">Available in 200+ cities across India</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metroCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/puja/${city.slug}`}
                  className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold">Puja in {city.name}</h3>
                  <p className="text-sm text-orange-100 mt-1">{city.state}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4 bg-orange-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {PAGE_FAQS.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white rounded-xl shadow-sm overflow-hidden group"
                >
                  <summary className="p-4 cursor-pointer font-semibold text-gray-800 hover:text-orange-600 transition-colors">
                    {faq.question}
                  </summary>
                  <div className="p-4 pt-0 text-gray-600">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Book Your Puja?</h2>
            <p className="text-orange-100 mb-8">
              Join thousands of satisfied devotees. Book your pandit now!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/pujaservice"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Browse All Pujas
              </Link>
              <Link
                href="/puja/purnia"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Book in Purnia
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
