import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Puja Online | Pandit for Puja Service',
  description:
    'Book this puja online with verified pandits on OKPUJA. Know puja vidhi, samagri, cost, benefits & best muhurat. Trusted puja service across India.',
  keywords: [
    'book puja online',
    'puja booking',
    'pandit for puja',
    'puja vidhi',
    'puja samagri',
    'puja cost',
    'puja benefits',
    'puja muhurat',
    'online puja service',
    'verified pandit',
    'puja at home',
    'book pandit online',
    'trusted puja service',
  ].join(', '),
  openGraph: {
    title: 'Book Puja Online | Pandit for Puja Service | OKPUJA',
    description: 'Book this puja online with verified pandits on OKPUJA.',
    url: 'https://okpuja.com/pujaservice',
    type: 'website',
  },
  alternates: {
    canonical: 'https://okpuja.com/pujaservice',
  },
};

export default function SinglePujaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
