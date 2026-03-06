import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define routes that require authentication
const protectedRoutes = ['/admin', '/employee', '/user']
const authRoutes = ['/login', '/register', '/verify-otp', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
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
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
