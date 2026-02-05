import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isValidTenant } from '@/lib/tenants'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Only handle /t/[tenantId] routes
  if (!pathname.startsWith('/t/')) {
    return NextResponse.next()
  }
  
  // Extract tenantId from path
  const pathParts = pathname.split('/')
  const tenantId = pathParts[2]
  
  // Validate tenant
  if (!tenantId || !isValidTenant(tenantId)) {
    return NextResponse.redirect(new URL('/t/tebca/auth/login', request.url))
  }
  
  // Check if this is an auth route or app route
  const isAuthRoute = pathname.includes('/auth/')
  const isAppRoute = !isAuthRoute && pathParts.length > 3
  
  // Get session cookie
  const sessionCookie = request.cookies.get('wallet-session')
  let session = null
  
  if (sessionCookie?.value) {
    try {
      session = JSON.parse(sessionCookie.value)
    } catch {
      // Invalid session cookie
    }
  }
  
  const isAuthenticated = session && session.tenantId === tenantId
  
  // Redirect unauthenticated users to login for app routes
  if (isAppRoute && !isAuthenticated) {
    const loginUrl = new URL(`/t/${tenantId}/auth/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated && pathname.endsWith('/login')) {
    return NextResponse.redirect(new URL(`/t/${tenantId}/dashboard`, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/t/:path*'],
}
