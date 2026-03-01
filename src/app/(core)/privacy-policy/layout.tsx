import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'OKPUJA Privacy Policy. Learn how we collect, use, and protect your personal information when you book puja services and astrology consultations on our platform.',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
