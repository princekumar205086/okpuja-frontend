import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About OKPUJA | India's Trusted Puja & Astrology Platform",
  description:
    "OKPUJA is India's leading platform for booking verified pandits for puja, havan, and astrology consultations. Based in Purnia, Bihar 854301, serving all of India with 100+ puja services.",
  keywords: [
    'about okpuja',
    'okpuja company',
    'puja booking platform india',
    'trusted puja service',
    'verified pandit platform',
    'hindu puja booking',
    'astrology platform india',
    'okpuja purnia',
    'best puja service india',
    'online pandit booking platform',
  ].join(', '),
  openGraph: {
    title: "About OKPUJA | India's Trusted Puja & Astrology Platform",
    description:
      "OKPUJA is India's leading platform for booking verified pandits for puja, havan, and astrology consultations.",
    url: 'https://okpuja.com/about',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
