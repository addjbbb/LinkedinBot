import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // NOTE: /espace-client protection is now done CLIENT-SIDE ONLY
  // Server-side middleware protection causes issues with Supabase cookie sync
  // The client-side pages will check auth and redirect if needed

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
