import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

// Use service role key for admin operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export interface Admin {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'super_admin'
  isActive: boolean
}

export interface AdminSession {
  token: string
  admin: Admin
  expiresAt: Date
}

// Sign in admin
export async function adminSignIn(email: string, password: string): Promise<AdminSession> {
  // Get admin by email
  const { data: admin, error: fetchError } = await supabaseAdmin
    .from('admins')
    .select('*')
    .eq('email', email.toLowerCase())
    .eq('is_active', true)
    .single()

  if (fetchError || !admin) {
    throw new Error('Email ou mot de passe incorrect')
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password_hash)
  if (!isPasswordValid) {
    throw new Error('Email ou mot de passe incorrect')
  }

  // Create session token
  const token = uuidv4()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 8) // 8 hours

  // Save session
  const { error: sessionError } = await supabaseAdmin
    .from('admin_sessions')
    .insert({
      admin_id: admin.id,
      token,
      expires_at: expiresAt.toISOString(),
    })

  if (sessionError) {
    throw new Error('Erreur lors de la création de la session')
  }

  // Update last login
  await supabaseAdmin
    .from('admins')
    .update({ last_login: new Date().toISOString() })
    .eq('id', admin.id)

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      firstName: admin.first_name,
      lastName: admin.last_name,
      role: admin.role,
      isActive: admin.is_active,
    },
    expiresAt,
  }
}

// Sign out admin
export async function adminSignOut(token: string): Promise<void> {
  await supabaseAdmin
    .from('admin_sessions')
    .delete()
    .eq('token', token)
}

// Verify admin session
export async function verifyAdminSession(token: string): Promise<Admin | null> {
  // Get session
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('admin_sessions')
    .select('*, admins(*)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (sessionError || !session) {
    return null
  }

  const admin = session.admins as any

  return {
    id: admin.id,
    email: admin.email,
    firstName: admin.first_name,
    lastName: admin.last_name,
    role: admin.role,
    isActive: admin.is_active,
  }
}

// Create admin (super admin only)
export async function createAdmin(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: 'admin' | 'super_admin'
}): Promise<void> {
  const passwordHash = await bcrypt.hash(data.password, 10)

  const { error } = await supabaseAdmin
    .from('admins')
    .insert({
      email: data.email.toLowerCase(),
      password_hash: passwordHash,
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role || 'admin',
    })

  if (error) {
    throw new Error('Erreur lors de la création de l\'admin')
  }
}

// Change admin password
export async function changeAdminPassword(adminId: string, newPassword: string): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, 10)

  const { error } = await supabaseAdmin
    .from('admins')
    .update({
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    })
    .eq('id', adminId)

  if (error) {
    throw new Error('Erreur lors du changement de mot de passe')
  }
}

// Clean expired sessions (call periodically)
export async function cleanExpiredSessions(): Promise<void> {
  await supabaseAdmin
    .from('admin_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString())
}
