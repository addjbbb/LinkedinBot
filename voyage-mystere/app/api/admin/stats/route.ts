import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get total bookings count
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })

    // Get pending bookings count
    const { count: pendingBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Get total revenue (sum of confirmed bookings)
    const { data: confirmedBookings } = await supabase
      .from('bookings')
      .select('total_price')
      .in('status', ['confirmed', 'completed'])

    const revenue = confirmedBookings?.reduce((sum, booking) => sum + Number(booking.total_price), 0) || 0

    // Get average rating from reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('is_published', true)

    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    // Calculate monthly growth (compare last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const { count: last30Days } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    const { count: previous30Days } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString())

    const monthlyGrowth = previous30Days && previous30Days > 0
      ? Math.round(((last30Days || 0) - previous30Days) / previous30Days * 100)
      : 0

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings: totalBookings || 0,
        pendingBookings: pendingBookings || 0,
        revenue: Math.round(revenue),
        avgRating: Math.round(avgRating * 10) / 10,
        monthlyGrowth,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
