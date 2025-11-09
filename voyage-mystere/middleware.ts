import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      // Redirect to admin login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Token verification will be done client-side via useAdminAuth hook
    // This is just a basic check to prevent unauthorized access
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
