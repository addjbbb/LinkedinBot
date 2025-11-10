import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

// Helper function to generate referral code
function generateReferralCode(firstName: string, lastName: string): string {
  const prefix = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase()
  const randomNum = Math.floor(1000 + Math.random() * 9000) // 4-digit number
  return `${prefix}${randomNum}`
}

// Sign up with email and password
export async function signUp(email: string, password: string, firstName: string, lastName: string, phone: string) {
  // Generate unique referral code
  const referralCode = generateReferralCode(firstName, lastName)

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        my_referral_code: referralCode,
      },
    },
  })

  if (authError) throw authError

  // Note: User profile is automatically created in public.users
  // via the handle_new_user() trigger in Supabase

  return authData
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  console.log('📡 signIn called with email:', email)

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('📡 Supabase response:', { data: !!data, error: !!error })

    if (error) {
      console.error('📡 Supabase error:', error)
      throw error
    }

    console.log('📡 signIn success, user:', data.user?.email)
    return data
  } catch (err) {
    console.error('📡 signIn exception:', err)
    throw err
  }
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current user
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile from users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email!,
    firstName: profile?.first_name,
    lastName: profile?.last_name,
  }
}

// Reset password
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/reset-password`,
  })

  if (error) throw error
}

// Update password
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
}

// Update user profile
export async function updateProfile(userId: string, data: {
  firstName?: string
  lastName?: string
  phone?: string
}) {
  const updateData: any = {}
  if (data.firstName) updateData.first_name = data.firstName
  if (data.lastName) updateData.last_name = data.lastName
  if (data.phone) updateData.phone = data.phone

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)

  if (error) throw error
}

// Get current session token
export async function getSessionToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}
