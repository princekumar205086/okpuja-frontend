/**
 * OKPUJA - Astrologers Redirect Page
 * Route: /astrologers
 * 
 * Redirects to /astrology for SEO-friendly 301 redirect
 */

import { redirect } from 'next/navigation';

export default function AstrologersPage() {
  redirect('/astrology');
}
