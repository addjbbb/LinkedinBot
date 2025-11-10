import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required', message: 'Vous devez être connecté pour effectuer un paiement.' },
        { status: 401 }
      )
    }

    // Create Supabase client with user's session
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    })

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required', message: 'Session expirée. Veuillez vous reconnecter.' },
        { status: 401 }
      )
    }

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
        { error: 'Missing required fields', message: 'Informations de réservation manquantes.' },
        { status: 400 }
      )
    }

    // Verify booking exists and belongs to user (with RLS)
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, status, user_id, total_price')
      .eq('id', bookingId)
      .maybeSingle()

    if (!booking || bookingError) {
      console.error(`Booking not found or RLS blocked: ${bookingId}`, bookingError)
      return NextResponse.json(
        {
          error: 'Booking not found',
          message: `La réservation n'existe pas ou vous n'avez pas accès à cette réservation.`,
          bookingId,
          details: bookingError?.message
        },
        { status: 404 }
      )
    }

    // Verify booking belongs to current user
    if (booking.user_id !== user.id) {
      console.error(`Booking ${bookingId} doesn't belong to user ${user.id}`)
      return NextResponse.json(
        {
          error: 'Access denied',
          message: 'Cette réservation ne vous appartient pas.'
        },
        { status: 403 }
      )
    }

    // Verify booking is in correct status
    if (!['draft', 'pending'].includes(booking.status)) {
      return NextResponse.json(
        {
          error: 'Invalid booking status',
          message: `Cette réservation n'est pas disponible pour le paiement (statut: ${booking.status}).`
        },
        { status: 400 }
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
      customerEmail: customerEmail || user.email,
    })

    // Update booking status to pending (using authenticated client)
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'pending' })
      .eq('id', bookingId)
      .eq('user_id', user.id) // Extra safety check

    if (updateError) {
      console.error('Failed to update booking status:', updateError)
      // Continue anyway as Stripe session is created
    }

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
