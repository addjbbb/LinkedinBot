import { NextRequest, NextResponse } from 'next/server'
import { adminSignIn } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const session = await adminSignIn(email, password)

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      token: session.token,
      admin: session.admin,
      expiresAt: session.expiresAt,
    })

    // Set secure HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production'
    response.cookies.set('admin_token', session.token, {
      httpOnly: true, // Prevents XSS attacks
      secure: isProduction, // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/admin', // Restrict to admin routes only
    })

    return response
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la connexion' },
      { status: 401 }
    )
  }
}
