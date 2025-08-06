import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Bookings | OkPuja',
  description: 'Manage your puja and astrology service bookings',
};

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
