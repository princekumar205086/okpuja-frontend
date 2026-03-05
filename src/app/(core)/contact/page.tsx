/**
 * OKPUJA - Contact Page Redirect
 * Route: /contact
 * 
 * Redirects to /contactus for SEO-friendly URL handling
 */

import { redirect } from 'next/navigation';

export default function ContactPage() {
  redirect('/contactus');
}
