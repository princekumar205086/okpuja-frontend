import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Puja Gallery | Photos of Hindu Puja & Havan Ceremonies',
  description:
    'Browse photos and videos of puja ceremonies, havan rituals, and astrology sessions performed by verified pandits on OKPUJA. See real puja celebrations across India.',
  keywords: [
    'puja gallery',
    'puja photos',
    'havan photos',
    'puja ceremony images',
    'hindu puja gallery',
    'puja celebration photos',
    'pandit performing puja',
    'havan ceremony images',
    'ganesh puja photos',
    'satyanarayan puja photos',
  ].join(', '),
  openGraph: {
    title: 'Puja Gallery | Photos of Hindu Puja & Havan Ceremonies | OKPUJA',
    description:
      'Browse photos and videos of puja ceremonies, havan rituals performed by verified pandits on OKPUJA.',
    url: 'https://okpuja.com/gallery',
    type: 'website',
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
