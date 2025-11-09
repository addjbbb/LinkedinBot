import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Generate a unique referral code
function generateReferralCode(firstName: string, lastName: string): string {
  const initials = (firstName[0] + lastName[0]).toUpperCase()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `${initials}${randomNum}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, firstName, lastName } = body

    if (!userId || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'User ID, firstName and lastName required' },
        { status: 400 }
      )
    }

    // Check if user already has a referral code
    const { data: existingReferral, error: fetchError } = await supabase
      .from('referrals')
      .select('referral_code')
      .eq('user_id', userId)
      .eq('referred_user_id', null) // This is the user's own code, not a referral from someone else
      .maybeSingle()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (existingReferral) {
      return NextResponse.json({
        success: true,
        referralCode: existingReferral.referral_code,
      })
    }

    // Generate new unique code
    let referralCode = generateReferralCode(firstName, lastName)
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
      const { data: existing } = await supabase
        .from('referrals')
        .select('id')
        .eq('referral_code', referralCode)
        .maybeSingle()

      if (!existing) {
        isUnique = true
      } else {
        referralCode = generateReferralCode(firstName, lastName)
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Unable to generate unique referral code' },
        { status: 500 }
      )
    }

    // Create referral record for the user
    const { error: insertError } = await supabase
      .from('referrals')
      .insert({
        user_id: userId,
        referral_code: referralCode,
        status: 'active',
      })

    if (insertError) throw insertError

    return NextResponse.json({
      success: true,
      referralCode,
    })
  } catch (error) {
    console.error('Error generating referral code:', error)
    return NextResponse.json(
      { error: 'Failed to generate referral code' },
      { status: 500 }
    )
  }
}
