import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /espace-client routes
  if (pathname.startsWith('/espace-client')) {
    const authCookie = request.cookies.get('sb-access-token')?.value ||
                       request.cookies.get('sb-127.0.0.1-auth-token')?.value

    if (!authCookie) {
      // No auth cookie, redirect to login
      const loginUrl = new URL('/auth/connexion', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Create Supabase client with the cookie
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${authCookie}`,
        },
      },
    })

    // Verify the session is valid
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      // Invalid session, redirect to login
      const loginUrl = new URL('/auth/connexion', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

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
  matcher: ['/admin/:path*', '/espace-client/:path*'],
}
