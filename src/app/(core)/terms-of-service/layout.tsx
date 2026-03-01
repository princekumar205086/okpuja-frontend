import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'OKPUJA Terms of Service. Read our terms and conditions for booking puja services, pandit bookings, and astrology consultations on our platform.',
  robots: { index: true, follow: true },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
