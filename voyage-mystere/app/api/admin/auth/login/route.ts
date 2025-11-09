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

    return NextResponse.json({
      success: true,
      token: session.token,
      admin: session.admin,
      expiresAt: session.expiresAt,
    })
  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la connexion' },
      { status: 401 }
    )
  }
}
