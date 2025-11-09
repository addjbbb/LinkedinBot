import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/supabase'
import { generateBookingNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      theme,
      startDate,
      endDate,
      numGuests,
      totalPrice,
      userEmail,
      firstName,
      lastName,
      phone,
    } = body

    // Validate required fields
    if (!theme || !startDate || !endDate || !totalPrice || !userEmail || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate theme
    if (!['romantique', 'nature', 'urbain'].includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme' },
        { status: 400 }
      )
    }

    // Generate booking number
    const bookingNumber = generateBookingNumber()

    // Create booking
    const booking = await createBooking({
      booking_number: bookingNumber,
      theme,
      start_date: startDate,
      end_date: endDate,
      num_guests: numGuests || 2,
      total_price: totalPrice,
      status: 'pending',
    })

    return NextResponse.json({
      success: true,
      booking,
      bookingNumber,
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID required' },
        { status: 400 }
      )
    }

    // Get booking from database
    const { getBooking } = await import('@/lib/supabase')
    const booking = await getBooking(bookingId)

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}
