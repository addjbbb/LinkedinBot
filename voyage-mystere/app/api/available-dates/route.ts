import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use admin client for reading availability (public data)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const theme = searchParams.get('theme')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!theme || !['romantique', 'nature', 'urbain'].includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid or missing theme parameter' },
        { status: 400 }
      )
    }

    // Build query
    let query = supabaseAdmin
      .from('available_dates')
      .select('date, is_available, max_bookings, current_bookings')
      .eq('theme', theme)
      .eq('is_available', true)
      .gte('date', new Date().toISOString().split('T')[0]) // Only future dates

    // Filter by date range if provided
    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data: availableDates, error } = await query

    if (error) {
      console.error('Error fetching available dates:', error)
      return NextResponse.json(
        { error: 'Failed to fetch available dates' },
        { status: 500 }
      )
    }

    // Filter dates where there's still capacity
    const datesWithCapacity = (availableDates || [])
      .filter(d => d.current_bookings < d.max_bookings)
      .map(d => d.date)

    return NextResponse.json({
      success: true,
      availableDates: datesWithCapacity,
    })
  } catch (error) {
    console.error('Error in available-dates API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
