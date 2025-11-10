import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to update booking.' },
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
        { error: 'Authentication required. Please log in to update booking.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      bookingId,
      userEmail,
      firstName,
      lastName,
      phone,
      address,
      specialRequests,
      totalPrice,
      status,
    } = body

    // Validate required fields
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID required' },
        { status: 400 }
      )
    }

    // Verify that the booking belongs to the authenticated user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('id', bookingId)
      .single()

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (existingBooking.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: This booking does not belong to you' },
        { status: 403 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (userEmail) updateData.email = userEmail
    if (firstName) updateData.first_name = firstName
    if (lastName) updateData.last_name = lastName
    if (phone) updateData.phone = phone
    if (specialRequests) updateData.special_requests = specialRequests
    if (totalPrice) updateData.total_price = totalPrice
    if (status) updateData.status = status

    // Parse address if provided
    if (address) {
      // Address format: "12 rue de la Paix, 75001 Paris"
      const addressParts = address.split(',').map((s: string) => s.trim())
      if (addressParts.length >= 2) {
        updateData.address_line1 = addressParts[0]

        // Extract postal code and city from "75001 Paris"
        const postalCity = addressParts[1].trim()
        const postalMatch = postalCity.match(/^(\d{5})\s+(.+)$/)

        if (postalMatch) {
          updateData.postal_code = postalMatch[1]
          updateData.city = postalMatch[2]
        } else {
          updateData.city = postalCity
        }
      }
    }

    // Update booking with authenticated client
    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      booking,
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
