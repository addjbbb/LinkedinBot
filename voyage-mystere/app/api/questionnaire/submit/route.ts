import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { matchDestination, assignDestinationToBooking } from '@/lib/destination-matcher'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to submit questionnaire.' },
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
        { error: 'Authentication required. Please log in to submit questionnaire.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      bookingId,
      occasion,
      travelerStyle,
      rhythm,
      budget,
      dietaryRestrictions,
      mobility,
      phobias,
      visitedRegions,
      maxDistance,
      transportPreference,
      accommodationType,
      preferredTime,
      desiredExperience,
      musicPreference,
    } = body

    // Validate required fields
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Verify that the booking belongs to the authenticated user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('user_id, theme')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: This booking does not belong to you' },
        { status: 403 }
      )
    }

    // Save questionnaire response with authenticated client
    const { data: response, error: insertError } = await supabase
      .from('questionnaire_responses')
      .insert({
        booking_id: bookingId,
        occasion: occasion || null,
        traveler_style: travelerStyle || [],
        rhythm: rhythm || null,
        budget: budget || null,
        dietary_restrictions: dietaryRestrictions || [],
        mobility: mobility || null,
        phobias: phobias || [],
        visited_regions: visitedRegions || [],
        max_distance: maxDistance || 300,
        transport_preference: transportPreference || null,
        accommodation_type: accommodationType || null,
        preferred_time: preferredTime || null,
        desired_experience: desiredExperience || null,
        music_preference: musicPreference || null,
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Match and assign destination based on questionnaire responses
    const questionnaireResponses = {
      occasion,
      travelerStyle,
      rhythm,
      budget,
      dietaryRestrictions,
      mobility,
      phobias,
      visitedRegions,
      maxDistance: maxDistance || 300,
      transportPreference,
      accommodationType,
      preferredTime,
      desiredExperience,
      musicPreference,
    }

    const matchResult = await matchDestination(booking.theme, questionnaireResponses)

    if (matchResult) {
      const assigned = await assignDestinationToBooking(bookingId, matchResult.destinationId)

      if (assigned) {
        console.log(`✅ Destination assigned to booking ${bookingId}:`, matchResult)
      } else {
        console.warn(`⚠️ Failed to assign destination to booking ${bookingId}`)
      }
    } else {
      console.warn(`⚠️ No destination match found for booking ${bookingId} with theme ${booking.theme}`)
    }

    return NextResponse.json({
      success: true,
      response,
      destination: matchResult ? {
        assigned: true,
        score: matchResult.score,
        reasons: matchResult.reasons,
      } : {
        assigned: false,
        message: 'No matching destination found'
      }
    })
  } catch (error) {
    console.error('Error saving questionnaire:', error)
    return NextResponse.json(
      { error: 'Failed to save questionnaire response', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
