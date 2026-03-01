import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Puja Services Online in India | 100+ Pujas Available',
  description:
    'Browse and book 100+ puja services online. Satyanarayan Puja, Griha Pravesh, Havan, Navgraha Puja & more. Verified pandits across India. Book now on OKPUJA.',
  keywords: [
    'puja services online',
    'book puja online india',
    'all puja services',
    'puja list',
    'hindu puja services',
    'puja seva online',
    'satyanarayan puja booking',
    'griha pravesh puja booking',
    'ganesh puja booking',
    'lakshmi puja booking',
    'havan booking online',
    'navagraha puja booking',
    'online puja booking',
    'pandit for puja',
    'book pandit online',
    'puja near me',
    'puja at home',
    'festival puja booking',
    'diwali puja booking',
    'navratri puja booking',
  ].join(', '),
  openGraph: {
    title: 'Book Puja Services Online in India | 100+ Pujas Available | OKPUJA',
    description:
      'Browse and book 100+ puja services online with verified pandits across India.',
    url: 'https://okpuja.com/pujaservice',
    type: 'website',
  },
};

export default function PujaServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
