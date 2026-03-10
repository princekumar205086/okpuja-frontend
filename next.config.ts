import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove console.log/warn in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable gzip compression
  compress: true,

  // Power optimizations
  reactStrictMode: true,

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
      },
      {
        protocol: "https",
        hostname: "api.okpuja.com",
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },

  // ============================================================
  // SEO REDIRECTS - 301 Permanent Redirects
  // ============================================================
  async redirects() {
    return [
      // Block development port URLs - redirect to production
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'okpuja.com:3000',
          },
        ],
        destination: 'https://okpuja.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'okpuja.com:8000',
          },
        ],
        destination: 'https://okpuja.com/:path*',
        permanent: true,
      },
      // Fix broken URLs reported in Google Search Console
      {
        source: '/services',
        destination: '/puja',
        permanent: true,
      },
      {
        source: '/astrologers',
        destination: '/astrology',
        permanent: true,
      },
      // Fix 404 URL variations from Search Console
      {
        source: '/puja/shiva-puja',
        destination: '/puja/shiv-puja',
        permanent: true,
      },
      {
        source: '/puja/janmashtami-puja',
        destination: '/puja/krishna-janmashtami-puja',
        permanent: true,
      },
      // pandit-requirements page (was 404)
      {
        source: '/pandit-requirements',
        destination: '/puja',
        permanent: true,
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
      // /singlepuja?service=xxx → /puja/xxx (old URL format indexed by Google)
      {
        source: '/singlepuja',
        has: [
          {
            type: 'query',
            key: 'service',
            value: '(?<slug>.*)',
          },
        ],
        destination: '/puja/:slug',
        permanent: true,
      },
      // /singlepuja without query → /pujaservice
      {
        source: '/singlepuja',
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
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/astrology_image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/blog_images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/video/:path*',
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
