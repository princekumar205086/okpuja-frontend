import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define routes that require authentication
const protectedRoutes = ['/admin', '/employee', '/user']
const authRoutes = ['/login', '/register', '/verify-otp', '/forgot-password']

// Routes that must NEVER be indexed by search engines
const noIndexPrefixes = ['/api/', '/admin', '/dashboard', '/employee', '/user', '/checkout', '/cart', '/login', '/register', '/verify-otp', '/forgot-password', '/reset-password', '/verify-email', '/confirmbooking', '/failedbooking', '/astro-booking-failed', '/astro-booking-success', '/payment-debug', '/payment-pending', '/test-payment']

/**
 * Resolve the real external origin — handles reverse proxy / load-balancer headers.
 * Falls back to the production domain when running in production.
 */
function getExternalOrigin(request: NextRequest): string {
  const proto =
    request.headers.get('x-forwarded-proto') ||
    (process.env.NODE_ENV === 'production' ? 'https' : 'http')
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'okpuja.com'
  return `${proto}://${host}`
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const host = request.headers.get('host') || ''

  // 1. www → non-www 301 redirect (use resolved origin, not request.url)
  if (host.startsWith('www.')) {
    const origin = getExternalOrigin(request).replace('://www.', '://')
    return NextResponse.redirect(new URL(`${origin}${pathname}${request.nextUrl.search}`), 301)
  }

  // 2. Strip ?lang= query param (no real i18n support — causes duplicate canonical issues)
  if (searchParams.has('lang')) {
    const origin = getExternalOrigin(request)
    const url = new URL(`${origin}${pathname}`)
    // Copy all params except lang
    searchParams.forEach((v, k) => {
      if (k !== 'lang') url.searchParams.set(k, v)
    })
    return NextResponse.redirect(url, 301)
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
    const origin = getExternalOrigin(request)
    const loginUrl = new URL(`${origin}/login`)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated and trying to access auth routes, redirect to appropriate dashboard
  if (isAuthRoute && accessToken) {
    const userRole = request.cookies.get('userRole')?.value?.toUpperCase()
    const origin = getExternalOrigin(request)

    let dashboardPath: string
    switch (userRole) {
      case 'ADMIN':
        dashboardPath = '/admin/dashboard'
        break
      case 'EMPLOYEE':
        dashboardPath = '/employee/dashboard'
        break
      default:
        dashboardPath = '/user/dashboard'
    }

    return NextResponse.redirect(new URL(`${origin}${dashboardPath}`))
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
