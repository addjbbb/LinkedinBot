import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    // Find referral by code
    const { data: referral, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', code.toUpperCase())
      .single()

    if (error || !referral) {
      return NextResponse.json(
        { error: 'Referral code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      referral: {
        code: referral.referral_code,
        discount: 50, // 50€ discount for referred user
      },
    })
  } catch (error) {
    console.error('Error fetching referral:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral' },
      { status: 500 }
    )
  }
}
