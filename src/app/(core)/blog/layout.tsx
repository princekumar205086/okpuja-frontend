import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Puja Guides, Astrology Tips & Spiritual Blog',
  description:
    'Read expert guides on puja vidhi, astrology tips, festival calendar, vastu shastra, and spiritual wellness. Learn from verified pandits and astrologers on OKPUJA.',
  keywords: [
    'puja guide',
    'astrology blog',
    'puja vidhi',
    'festival guide india',
    'spiritual blog',
    'hindu puja articles',
    'havan guide',
    'vastu tips',
    'kundli guide',
    'puja samagri list',
    'best time for puja',
    'how to perform puja',
    'puja benefits',
    'navratri guide',
    'diwali puja guide',
  ].join(', '),
  openGraph: {
    title: 'Puja Guides, Astrology Tips & Spiritual Blog | OKPUJA',
    description:
      'Read expert guides on puja vidhi, astrology tips, festival calendar, vastu shastra, and spiritual wellness.',
    url: 'https://okpuja.com/blog',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
