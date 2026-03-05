import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "okpuja.com",
      }
    ],
  },

  // ============================================================
  // SEO REDIRECTS - 301 Permanent Redirects
  // ============================================================
  async redirects() {
    return [
      // Fix broken URLs reported in Google Search Console
      {
        source: '/services',
        destination: '/puja',
        permanent: true, // 301 redirect
      },
      {
        source: '/astrologers',
        destination: '/astrology',
        permanent: true, // 301 redirect
      },
      // Legacy URL redirects
      {
        source: '/pandit-booking',
        destination: '/puja',
        permanent: true,
      },
      {
        source: '/book-pandit',
        destination: '/puja',
        permanent: true,
      },
      {
        source: '/online-puja',
        destination: '/puja',
        permanent: true,
      },
      {
        source: '/havan-booking',
        destination: '/puja',
        permanent: true,
      },
      {
        source: '/astrologer',
        destination: '/astrology',
        permanent: true,
      },
      {
        source: '/jyotish',
        destination: '/astrology',
        permanent: true,
      },
      {
        source: '/kundli',
        destination: '/astrology',
        permanent: true,
      },
      // Contact variations
      {
        source: '/contact',
        destination: '/contactus',
        permanent: true,
      },
      // About variations
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      // Blog variations
      {
        source: '/blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/articles',
        destination: '/blog',
        permanent: true,
      },
      // Service page variations
      {
        source: '/puja-services',
        destination: '/pujaservice',
        permanent: true,
      },
      {
        source: '/puja-service',
        destination: '/pujaservice',
        permanent: true,
      },
      {
        source: '/all-pujas',
        destination: '/pujaservice',
        permanent: true,
      },
    ];
  },

  // ============================================================
  // SEO HEADERS
  // ============================================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Cache static assets
      {
        source: '/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
