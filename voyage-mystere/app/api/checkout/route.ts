import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { getBooking, updateBooking } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      bookingId,
      theme,
      amount,
      customerEmail,
    } = body

    // Validate required fields
    if (!bookingId || !theme || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify booking exists
    const booking = await getBooking(bookingId)
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const session = await createCheckoutSession({
      bookingId,
      theme,
      amount,
      successUrl: `${baseUrl}/reserver/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/reserver/paiement?booking_id=${bookingId}`,
      customerEmail,
    })

    // Update booking with session ID
    await updateBooking(bookingId, {
      status: 'pending',
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
