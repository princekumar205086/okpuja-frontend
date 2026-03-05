/**
 * OKPUJA - Services Redirect Page
 * Route: /services
 * 
 * Redirects to /puja for SEO-friendly 301 redirect
 */

import { redirect } from 'next/navigation';

export default function ServicesPage() {
  redirect('/puja');
}
