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
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('my_referral_code')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    if (user?.my_referral_code) {
      return NextResponse.json({
        success: true,
        referralCode: user.my_referral_code,
      })
    }

    // Generate new unique code
    let referralCode = generateReferralCode(firstName, lastName)
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 10) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('my_referral_code', referralCode)
        .maybeSingle()

      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referral_code', referralCode)
        .maybeSingle()

      if (!existingUser && !existingReferral) {
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

    // Update user with referral code
    const { error: updateError } = await supabase
      .from('users')
      .update({ my_referral_code: referralCode })
      .eq('id', userId)

    if (updateError) throw updateError

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
