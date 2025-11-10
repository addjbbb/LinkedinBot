import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /espace-client routes
  if (pathname.startsWith('/espace-client')) {
    // Find Supabase auth cookie - it's named sb-<project-id>-auth-token
    const allCookies = request.cookies.getAll()
    const authCookie = allCookies.find(cookie =>
      cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
    )

    if (!authCookie?.value) {
      // No auth cookie, redirect to login
      const loginUrl = new URL('/auth/connexion', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Parse the cookie value - it's a JSON string with access_token
    try {
      const cookieData = JSON.parse(authCookie.value)
      const accessToken = cookieData.access_token

      if (!accessToken) {
        throw new Error('No access token in cookie')
      }

      // Create Supabase client with the access token
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
    } catch (err) {
      // Cookie parsing failed, redirect to login
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
