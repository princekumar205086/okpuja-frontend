import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Astrology Consultation India | Talk to Astrologer',
  description:
    'Consult with experienced astrologers online. Kundli matching, horoscope reading, vastu consultation, numerology & more. Talk to verified astrologers on OKPUJA.',
  keywords: [
    'online astrology consultation',
    'talk to astrologer online',
    'kundli matching online',
    'horoscope reading online',
    'vastu consultation india',
    'jyotish consultation online',
    'best astrologer india',
    'numerology consultation',
    'tarot reading online',
    'vedic astrology',
    'astrologer near me',
    'online jyotish',
    'career astrology',
    'marriage astrology',
    'astrologer purnia',
    'astrology consultation purnia',
  ].join(', '),
  openGraph: {
    title: 'Online Astrology Consultation India | Talk to Astrologer | OKPUJA',
    description:
      'Consult with experienced astrologers online. Kundli matching, horoscope reading, vastu consultation & more.',
    url: 'https://okpuja.com/astrology',
    type: 'website',
  },
};

export default function AstrologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
