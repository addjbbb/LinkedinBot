import { NextRequest, NextResponse } from 'next/server'
import { updateBooking } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
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

    // Update booking
    const booking = await updateBooking(bookingId, updateData)

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
