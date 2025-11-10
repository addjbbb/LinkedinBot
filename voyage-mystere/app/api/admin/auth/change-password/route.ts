import { NextRequest, NextResponse } from 'next/server'
import { changeAdminPassword, verifyAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { newPassword, currentPassword } = body

    if (!newPassword) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe est requis' },
        { status: 400 }
      )
    }

    // Get token from cookie or authorization header
    const token = request.cookies.get('admin_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Verify admin session
    const admin = await verifyAdminSession(token)

    if (!admin) {
      return NextResponse.json(
        { error: 'Session invalide ou expirée' },
        { status: 401 }
      )
    }

    // Change password (includes validation)
    await changeAdminPassword(admin.id, newPassword)

    return NextResponse.json({
      success: true,
      message: 'Mot de passe changé avec succès',
    })
  } catch (error: any) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors du changement de mot de passe' },
      { status: 400 }
    )
  }
}
