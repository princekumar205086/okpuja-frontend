/**
 * OKPUJA - Dynamic City Landing Page
 * Route: /puja/[city]
 * 
 * Auto-generates SEO-optimized landing pages for 200+ Indian cities
 * Each page includes: city intro, puja list, FAQ, local keywords, LocalBusiness schema
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INDIA_CITIES, PUJA_SERVICES } from '@/lib/seo/keywords';
import { getCityPageMetadata } from '@/lib/seo/metadata';
import { buildCityPageSchemas } from '@/lib/seo/schema';
import { getCityFAQs, getCityPujaContent, getCityBySlug } from '@/lib/seo/cityData';
import { SchemaScript } from '@/lib/seo/SchemaScript';
import Link from 'next/link';

// ============================================================
// STATIC PARAMS - Pre-generate all city pages
// ============================================================
export async function generateStaticParams() {
  return INDIA_CITIES.map((city) => ({
    city: city.slug,
  }));
}

// ============================================================
// DYNAMIC METADATA
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const cityData = getCityBySlug(citySlug);

  if (!cityData) {
    return { title: 'City Not Found | OKPUJA' };
  }

  return getCityPageMetadata(cityData.name, citySlug, cityData.state);
}

// ============================================================
// PAGE COMPONENT
// ============================================================
export default async function CityPujaPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const cityData = getCityBySlug(citySlug);

  if (!cityData) {
    notFound();
  }

  const content = getCityPujaContent(cityData.name, cityData.state);
  const faqs = getCityFAQs(cityData.name, cityData.state);
  const popularPujas = PUJA_SERVICES.filter((p) => p.category === 'popular').slice(0, 12);
  const festivalPujas = PUJA_SERVICES.filter((p) => p.category === 'festival').slice(0, 8);
  const astrologyPujas = PUJA_SERVICES.filter((p) => p.category === 'astrology').slice(0, 6);

  // Build schemas
  const schemas = buildCityPageSchemas(
    cityData.name,
    cityData.state,
    [
      { name: 'Home', url: '/' },
      { name: 'Puja Services', url: '/pujaservice' },
      { name: `Puja in ${cityData.name}`, url: `/puja/${citySlug}` },
    ],
    faqs
  );

  // Nearby cities (same state)
  const nearbyCities = INDIA_CITIES.filter(
    (c) => c.state === cityData.state && c.slug !== citySlug
  ).slice(0, 8);

  return (
    <>
      <SchemaScript schemas={schemas} />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center justify-center gap-2">
                <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
                <li>/</li>
                <li><Link href="/pujaservice" className="hover:text-orange-600">Puja Services</Link></li>
                <li>/</li>
                <li className="text-orange-600 font-medium">{cityData.name}</li>
              </ol>
            </nav>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Book Pandit in {cityData.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Trusted Puja & Astrology Services in {cityData.name}, {cityData.state}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">⭐ 4.8 Rating</span>
              <span>•</span>
              <span>2500+ Happy Customers</span>
              <span>•</span>
              <span>100+ Services</span>
            </div>
          </div>
        </section>

        {/* City Introduction */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Puja Services in {cityData.name}, {cityData.state}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {content.intro}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {content.description}
            </p>
          </div>
        </section>

        {/* Popular Puja Services */}
        <section className="py-12 px-4 bg-orange-50/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Popular Puja Services in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {popularPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/puja/${puja.slug}`}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-orange-100"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{puja.name}</h3>
                  <p className="text-sm text-gray-500">{puja.hindi}</p>
                  <p className="text-xs text-orange-600 mt-2">
                    Book in {cityData.name} →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Festival Pujas */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Festival Puja Bookings in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {festivalPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/puja/${puja.slug}`}
                  className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100 hover:border-orange-300 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{puja.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Book for {cityData.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Astrology Services */}
        <section className="py-12 px-4 bg-indigo-50/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Astrology Services in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {astrologyPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/puja/${puja.slug}`}
                  className="bg-white rounded-lg p-4 border border-indigo-100 hover:border-indigo-300 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{puja.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{puja.hindi} - {cityData.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose OKPUJA */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Choose OKPUJA in {cityData.name}?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.whyChoose.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50"
                >
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-gray-700">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 px-4 bg-orange-50/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              How to Book Puja in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Select Puja', desc: `Browse 100+ puja services available in ${cityData.name}. Choose the puja you need.` },
                { step: '2', title: 'Choose Date & Time', desc: `Pick a convenient date, time, or muhurat for your puja in ${cityData.name}.` },
                { step: '3', title: 'Confirm Booking', desc: `Our verified pandit arrives at your doorstep in ${cityData.name} with all samagri.` },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions - Puja in {cityData.name}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-between">
                    {faq.question}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-6 py-4 text-gray-600 border-t border-gray-100 bg-gray-50/50">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby Cities - Internal Linking */}
        {nearbyCities.length > 0 && (
          <section className="py-12 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Puja Services in Nearby Cities
              </h2>
              <div className="flex flex-wrap gap-3">
                {nearbyCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/puja/${city.slug}`}
                    className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-colors"
                  >
                    Puja in {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All India Cities Link Cloud */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Puja Services Across India
            </h2>
            <div className="flex flex-wrap gap-2">
              {INDIA_CITIES.filter((c) => c.tier <= 2).slice(0, 30).map((city) => (
                <Link
                  key={city.slug}
                  href={`/puja/${city.slug}`}
                  className="text-sm text-gray-500 hover:text-orange-600 underline decoration-dotted"
                >
                  {city.name}
                </Link>
              ))}
              <span className="text-sm text-gray-400">& 170+ more cities</span>
            </div>
          </div>
        </section>

        {/* SEO Text Block */}
        <section className="py-8 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs text-gray-400 leading-relaxed">
              OKPUJA - Book verified pandits for puja, havan, and astrology services in {cityData.name}, {cityData.state}. 
              We offer Satyanarayan Puja, Griha Pravesh, Ganesh Puja, Lakshmi Puja, Navgraha Shanti, Havan, Mundan, 
              Wedding Puja, and 100+ more services. Our pandits are verified, experienced, and bring all necessary 
              samagri. Available for home, office, and temple puja in {cityData.name}. Book puja near me in {cityData.name}. 
              Best pandit in {cityData.name}. Trusted puja service {cityData.state}. Astrologer in {cityData.name}. 
              Kundli matching in {cityData.name}. Vastu consultant {cityData.name}. OKPUJA serves {cityData.name} and 
              all nearby areas with doorstep puja services.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
