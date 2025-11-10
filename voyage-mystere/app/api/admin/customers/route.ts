import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch all customers with their booking stats
export async function GET(request: NextRequest) {
  try {
    // Fetch all users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (usersError) throw usersError

    // Fetch booking counts and totals for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get booking count
        const { data: bookings, error: bookingsError } = await supabaseAdmin
          .from('bookings')
          .select('total_price, status')
          .eq('user_id', user.id)

        if (bookingsError) throw bookingsError

        const totalBookings = bookings?.length || 0
        const totalSpent = bookings?.reduce((sum, b) => sum + parseFloat(b.total_price), 0) || 0
        const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0

        return {
          ...user,
          totalBookings,
          totalSpent,
          completedBookings,
        }
      })
    )

    return NextResponse.json({ success: true, customers: usersWithStats })
  } catch (error: any) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET individual customer details
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    // Get user details
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // Get user bookings
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (bookingsError) throw bookingsError

    // Get user referrals
    const { data: referrals, error: referralsError } = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)

    if (referralsError) throw referralsError

    return NextResponse.json({
      success: true,
      customer: {
        ...user,
        bookings,
        referrals,
      },
    })
  } catch (error: any) {
    console.error('Error fetching customer details:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
