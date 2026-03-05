/**
 * OKPUJA - SEO-Friendly 404 Page
 * 
 * Custom not found page with:
 * - Suggested puja services
 * - City links (Bihar focus)
 * - Search functionality
 * - Internal navigation
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { INDIA_CITIES, PUJA_SERVICES } from '@/lib/seo/keywords';
import { SITE_CONFIG } from '@/lib/seo/seoConfig';

export const metadata: Metadata = {
  title: 'Page Not Found | OKPUJA',
  description:
    'The page you are looking for does not exist. Browse our puja services or explore puja booking in Purnia, Bihar and other cities.',
  robots: {
    index: false,
    follow: true,
  },
};

// Bihar priority cities
const BIHAR_CITIES = [
  { name: 'Purnia', slug: 'purnia' },
  { name: 'Katihar', slug: 'katihar' },
  { name: 'Araria', slug: 'araria' },
  { name: 'Bhagalpur', slug: 'bhagalpur' },
  { name: 'Madhepura', slug: 'madhepura' },
  { name: 'Kishanganj', slug: 'kishanganj' },
  { name: 'Saharsa', slug: 'saharsa' },
  { name: 'Patna', slug: 'patna' },
];

export default function NotFound() {
  const popularPujas = PUJA_SERVICES.filter((p) => p.category === 'popular').slice(0, 6);
  const metroCities = INDIA_CITIES.filter((c) => c.tier === 1).slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full">
              <span className="text-4xl">🛕</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Don&apos;t worry, you can find plenty of puja services from our homepage.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto mb-12">
            <form action="/pujaservice" method="get" className="flex gap-2">
              <input
                type="text"
                name="search"
                placeholder="Search for pujas..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/"
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Go to Homepage
            </Link>
            <Link
              href="/puja"
              className="px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
            >
              Browse All Pujas
            </Link>
            <Link
              href="/contactus"
              className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Pujas */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Popular Puja Services
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularPujas.map((puja) => (
              <Link
                key={puja.slug}
                href="/pujaservice"
                className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl text-center hover:shadow-md transition-all group"
              >
                <h4 className="font-semibold text-gray-800 text-sm group-hover:text-orange-600 transition-colors">
                  {puja.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{puja.hindi}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bihar Cities */}
      <section className="py-12 px-4 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Book Pandit in Bihar
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Trusted puja services in Purnia, Katihar, Araria &amp; nearby areas
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BIHAR_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/puja/${city.slug}`}
                className="bg-white p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-all group"
              >
                <h4 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  Puja in {city.name}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Metro Cities */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Services in Major Cities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metroCities.map((city) => (
              <Link
                key={city.slug}
                href={`/puja/${city.slug}`}
                className="bg-gray-50 p-4 rounded-xl text-center hover:bg-orange-50 transition-all group"
              >
                <h4 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {city.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{city.state}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Helpful Links */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Helpful Links
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Link
              href="/astrology"
              className="p-4 bg-white rounded-lg hover:bg-orange-50 transition-colors"
            >
              <span className="block text-2xl mb-2">⭐</span>
              <span className="text-sm font-medium text-gray-700">Astrology</span>
            </Link>
            <Link
              href="/blog"
              className="p-4 bg-white rounded-lg hover:bg-orange-50 transition-colors"
            >
              <span className="block text-2xl mb-2">📚</span>
              <span className="text-sm font-medium text-gray-700">Blog</span>
            </Link>
            <Link
              href="/about"
              className="p-4 bg-white rounded-lg hover:bg-orange-50 transition-colors"
            >
              <span className="block text-2xl mb-2">ℹ️</span>
              <span className="text-sm font-medium text-gray-700">About Us</span>
            </Link>
            <Link
              href="/contactus"
              className="p-4 bg-white rounded-lg hover:bg-orange-50 transition-colors"
            >
              <span className="block text-2xl mb-2">📞</span>
              <span className="text-sm font-medium text-gray-700">Contact</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Can&apos;t find what you need?</h3>
          <p className="text-orange-100 mb-6">
            Contact us and we&apos;ll help you find the right puja service.
          </p>
          <Link
            href="/contactus"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
