import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact OKPUJA | Get Help with Puja Booking',
  description:
    'Contact OKPUJA for puja booking assistance, pandit enquiries, astrology consultation, and customer support. Located in Ram Ratan Ji Nagar, Rambagh, Purnia, Bihar 854301.',
  keywords: [
    'contact okpuja',
    'okpuja support',
    'puja booking help',
    'pandit booking enquiry',
    'okpuja customer care',
    'okpuja purnia address',
    'okpuja phone number',
    'puja service enquiry',
  ].join(', '),
  openGraph: {
    title: 'Contact OKPUJA | Get Help with Puja Booking',
    description:
      'Contact OKPUJA for puja booking assistance, pandit enquiries, astrology consultation, and customer support.',
    url: 'https://okpuja.com/contactus',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
