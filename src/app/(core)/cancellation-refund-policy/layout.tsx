import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy',
  description:
    'OKPUJA Cancellation and Refund Policy for puja bookings, pandit services, and astrology consultations.',
  robots: { index: true, follow: true },
};

export default function CancellationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
