import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const theme = searchParams.get('theme')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('bookings')
      .select(`
        id,
        booking_number,
        theme,
        start_date,
        end_date,
        total_price,
        status,
        payment_status,
        email,
        first_name,
        last_name,
        phone,
        num_guests,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`booking_number.ilike.%${search}%,email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (theme) {
      query = query.eq('theme', theme)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: bookings, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      bookings: bookings || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, status, paymentStatus } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID required' },
        { status: 400 }
      )
    }

    const updates: any = { updated_at: new Date().toISOString() }
    if (status) updates.status = status
    if (paymentStatus) updates.payment_status = paymentStatus

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      booking: data,
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
