import { NextRequest, NextResponse } from 'next/server'
import { saveQuestionnaireResponse } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
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

    // Save questionnaire response
    const response = await saveQuestionnaireResponse({
      booking_id: bookingId,
      occasion: occasion || '',
      traveler_style: travelerStyle || [],
      rhythm: rhythm || '',
      budget: budget || '',
      dietary_restrictions: dietaryRestrictions || [],
      mobility: mobility || '',
      phobias: phobias || [],
      visited_regions: visitedRegions || [],
      max_distance: maxDistance || 300,
      transport_preference: transportPreference || '',
      accommodation_type: accommodationType || '',
      preferred_time: preferredTime || '',
      desired_experience: desiredExperience || '',
      music_preference: musicPreference || '',
    })

    return NextResponse.json({
      success: true,
      response,
    })
  } catch (error) {
    console.error('Error saving questionnaire:', error)
    return NextResponse.json(
      { error: 'Failed to save questionnaire response' },
      { status: 500 }
    )
  }
}
