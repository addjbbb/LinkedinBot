import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email required' },
        { status: 400 }
      )
    }

    // Get bookings for user (either by user_id or email for guest bookings)
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.or(`user_id.eq.${userId},email.eq.${email}`)
    } else if (email) {
      query = query.eq('email', email)
    }

    const { data: bookings, error } = await query

    if (error) throw error

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
