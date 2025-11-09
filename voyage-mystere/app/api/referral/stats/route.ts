import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Get user's referrals
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('user_id', userId)

    if (referralsError) throw referralsError

    // Count completed referrals
    const completedReferrals = referrals?.filter(r => r.status === 'completed').length || 0

    // Get user's credits
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)

    if (creditsError) throw creditsError

    // Calculate total earned and available credits
    const totalEarned = credits?.reduce((sum, credit) => sum + Number(credit.amount), 0) || 0
    const availableCredits = credits?.filter(c => !c.is_used && (!c.expires_at || new Date(c.expires_at) > new Date()))
      .reduce((sum, credit) => sum + Number(credit.amount), 0) || 0

    // Count pending referrals
    const pendingReferrals = referrals?.filter(r => r.status === 'pending').length || 0

    return NextResponse.json({
      success: true,
      stats: {
        totalReferrals: referrals?.length || 0,
        completedReferrals,
        pendingReferrals,
        totalEarned: Math.round(totalEarned),
        availableCredits: Math.round(availableCredits),
      },
    })
  } catch (error) {
    console.error('Error fetching referral stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
