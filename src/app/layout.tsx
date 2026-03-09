import type { Metadata, Viewport } from "next";
import ToasterClient from "./ToasterClient";
import EmotionProvider from "./EmotionProvider";
import { LoadingProvider } from "./context/LoadingContext";
import ThemeInitializer from "./components/ThemeInitializer";
import AppWrapper from "./components/AppWrapper";
import { SchemaScript } from "@/lib/seo/SchemaScript";
import { buildGlobalSchemas } from "@/lib/seo";
import { SITE_CONFIG, DEFAULT_ROBOTS } from "@/lib/seo/seoConfig";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF6B35' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'OKPUJA | Book Pandit Online in India | Puja & Astrology Services',
    template: '%s | OKPUJA',
  },
  description:
    'Book verified pandits for puja, havan, and astrology consultation across India. 100+ puja services, 200+ cities. Trusted puja services in Purnia Bihar 854301.',
  keywords: [
    'puja booking online',
    'book pandit online',
    'online puja service india',
    'puja near me',
    'pandit near me',
    'havan booking',
    'astrologer consultation online',
    'puja service purnia',
    'pandit in purnia',
    'best pandit india',
    'hindu puja booking',
    'verified pandit',
    'okpuja',
    'puja at home',
    'online pandit booking',
    'astrology consultation india',
    'kundli matching online',
    'vastu consultation',
    'griha pravesh puja',
    'satyanarayan puja booking',
  ],
  robots: DEFAULT_ROBOTS,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: 'OKPUJA | Book Pandit Online in India | Puja & Astrology Services',
    description:
      'Book verified pandits for puja, havan, and astrology consultation across India. Trusted puja services in Purnia Bihar 854301.',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: 'website',
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=Book+Pandit+Online+in+India`,
        width: 1200,
        height: 630,
        alt: 'OKPUJA - Book Pandit Online in India',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OKPUJA | Book Pandit Online in India',
    description:
      'Book verified pandits for puja, havan, and astrology consultation across India.',
    images: [`${SITE_CONFIG.url}/api/og?title=Book+Pandit+Online+in+India`],
    creator: SITE_CONFIG.twitterHandle,
    site: SITE_CONFIG.twitterHandle,
  },
  verification: {
    google: 'your-google-verification-id',
  },
  other: {
    'geo.region': 'IN-BR',
    'geo.placename': 'Purnia',
    'geo.position': `${SITE_CONFIG.business.geo.latitude};${SITE_CONFIG.business.geo.longitude}`,
    'ICBM': `${SITE_CONFIG.business.geo.latitude}, ${SITE_CONFIG.business.geo.longitude}`,
    'revisit-after': '3 days',
    'rating': 'general',
    'distribution': 'global',
  },
  applicationName: SITE_CONFIG.name,
  referrer: 'origin-when-cross-origin',
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  category: 'Religion, Spirituality, Astrology',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/image/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/image/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning={true}>
      <head>
        {/* Global JSON-LD Structured Data: Organization + LocalBusiness + WebSite */}
        <SchemaScript schemas={buildGlobalSchemas()} />
        
        {/* Inline script to set initial theme class before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const mode = localStorage.getItem('theme') || 'light';
                if (mode === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.body.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.body.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ik.imagekit.io" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
      </head>
      <body suppressHydrationWarning={true}>
        <ThemeInitializer />
        <EmotionProvider>
          <LoadingProvider>
            <AppWrapper>
              {children}
            </AppWrapper>
            <ToasterClient />
          </LoadingProvider>
        </EmotionProvider>
      </body>
    </html>
  );
}