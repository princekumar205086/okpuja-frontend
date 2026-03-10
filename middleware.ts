import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define routes that require authentication
const protectedRoutes = ['/admin', '/employee', '/user']
const authRoutes = ['/login', '/register', '/verify-otp', '/forgot-password']

// Routes that must NEVER be indexed by search engines
const noIndexPrefixes = ['/api/', '/admin', '/dashboard', '/employee', '/user', '/checkout', '/cart', '/login', '/register', '/verify-otp', '/forgot-password', '/reset-password', '/verify-email', '/confirmbooking', '/failedbooking', '/astro-booking-failed', '/astro-booking-success', '/payment-debug', '/payment-pending', '/test-payment']

// Development ports that should never be publicly accessible
const DEV_PORTS = [':3000', ':8000', ':5173', ':4200', ':3001', ':8080']

const PRODUCTION_ORIGIN = 'https://okpuja.com'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const host = request.headers.get('host') || ''

  // 0. Block development port URLs — redirect to production
  const hasDevPort = DEV_PORTS.some(port => host.includes(port))
  if (hasDevPort && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(
      new URL(`${PRODUCTION_ORIGIN}${pathname}${request.nextUrl.search}`),
      301
    )
  }

  // 1. www → non-www 301 redirect
  if (host.startsWith('www.')) {
    const newUrl = new URL(request.url)
    newUrl.host = host.replace('www.', '')
    return NextResponse.redirect(newUrl, 301)
  }

  // 1b. Enforce HTTPS in production
  if (process.env.NODE_ENV === 'production' && request.nextUrl.protocol === 'http:') {
    const newUrl = new URL(request.url)
    newUrl.protocol = 'https:'
    return NextResponse.redirect(newUrl, 301)
  }

  // 2. Strip ?lang= query param (no real i18n support — causes duplicate canonical issues)
  if (searchParams.has('lang')) {
    const newUrl = new URL(request.url)
    newUrl.searchParams.delete('lang')
    return NextResponse.redirect(newUrl, 301)
  }

  // Check if this route should be blocked from indexing
  const shouldNoIndex = noIndexPrefixes.some(prefix => pathname.startsWith(prefix))
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Get auth tokens from cookies or headers
  const accessToken = request.cookies.get('access')?.value || 
                      request.headers.get('authorization')?.replace('Bearer ', '')
  
  // If it's a protected route and no access token, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If user is authenticated and trying to access auth routes, redirect to appropriate dashboard
  if (isAuthRoute && accessToken) {
    // Get user role from cookie to redirect to the correct dashboard
    const userRole = request.cookies.get('userRole')?.value?.toUpperCase()
    
    let dashboardUrl: URL
    switch (userRole) {
      case 'ADMIN':
        dashboardUrl = new URL('/admin/dashboard', request.url)
        break
      case 'EMPLOYEE':
        dashboardUrl = new URL('/employee/dashboard', request.url)
        break
      default:
        dashboardUrl = new URL('/user/dashboard', request.url)
    }
    
    return NextResponse.redirect(dashboardUrl)
  }
  
  const response = NextResponse.next()
  
  // Add X-Robots-Tag: noindex for non-public routes to prevent Google indexing
  if (shouldNoIndex) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
