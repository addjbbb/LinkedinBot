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
      console.error(`Booking not found: ${bookingId}`)
      return NextResponse.json(
        {
          error: 'Booking not found',
          message: `La réservation ${bookingId} n'existe pas ou a été supprimée.`,
          bookingId
        },
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
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: error?.message || 'Une erreur est survenue lors de la création de la session de paiement.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
