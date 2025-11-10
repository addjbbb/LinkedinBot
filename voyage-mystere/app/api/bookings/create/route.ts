import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateBookingNumber } from '@/lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to create a booking.' },
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

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to create a booking.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      theme,
      startDate,
      endDate,
      numGuests,
      totalPrice,
      firstName,
      lastName,
      phone,
      status, // Pour créer un booking en mode 'draft' ou 'pending'
    } = body

    // Validate required minimum fields
    if (!theme || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: theme, startDate, endDate' },
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

    // Déterminer le prix selon le thème (si pas fourni)
    const priceMap: Record<string, number> = {
      romantique: 890,
      nature: 750,
      urbain: 820,
    }
    const price = totalPrice || priceMap[theme]

    // Create booking with authenticated user_id
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        booking_number: bookingNumber,
        user_id: user.id, // Automatically set from authenticated user
        email: user.email, // Use authenticated user's email
        theme,
        start_date: startDate,
        end_date: endDate,
        num_guests: numGuests || 2,
        total_price: price,
        status: status || 'pending',
        // Optional fields from request
        ...(firstName && { first_name: firstName }),
        ...(lastName && { last_name: lastName }),
        ...(phone && { phone }),
      })
      .select()
      .single()

    if (bookingError) throw bookingError

    return NextResponse.json({
      success: true,
      booking,
      bookingId: booking.id,
      bookingNumber,
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking', details: error instanceof Error ? error.message : 'Unknown error' },
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
