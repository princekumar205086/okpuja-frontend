import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career at OKPUJA | Join India\'s Leading Puja Platform',
  description:
    'Join OKPUJA team. Career opportunities in India\'s fastest-growing puja and astrology booking platform. Work with us from Purnia, Bihar.',
  keywords: [
    'okpuja careers',
    'okpuja jobs',
    'puja platform jobs',
    'work at okpuja',
    'okpuja team',
  ].join(', '),
};

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
