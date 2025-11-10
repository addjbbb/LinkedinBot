/**
 * Revelation Code Generation System
 * Generates unique codes to reveal mystery destinations 48h before departure
 */

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client for revelation code operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Generate a unique, memorable revelation code
 * Format: XXXX-XXXX (e.g., "AB7K-M3Q9")
 */
export function generateRevelationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''

  for (let i = 0; i < 8; i++) {
    if (i === 4) {
      code += '-'
    }
    const randomIndex = crypto.randomInt(0, chars.length)
    code += chars[randomIndex]
  }

  return code
}

/**
 * Check if a code already exists in the database
 */
async function codeExists(code: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('revelation_code')
    .eq('revelation_code', code)
    .maybeSingle()

  if (error) {
    console.error('Error checking code existence:', error)
    return true // Assume it exists to be safe
  }

  return data !== null
}

/**
 * Generate a unique revelation code (not already in database)
 */
export async function generateUniqueRevelationCode(): Promise<string> {
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const code = generateRevelationCode()
    const exists = await codeExists(code)

    if (!exists) {
      return code
    }

    attempts++
  }

  // Fallback: add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36).toUpperCase()
  return `${generateRevelationCode()}-${timestamp}`
}

/**
 * Assign revelation code to a booking
 */
export async function assignRevelationCode(bookingId: string): Promise<string | null> {
  try {
    // Check if booking already has a code
    const { data: existing } = await supabaseAdmin
      .from('bookings')
      .select('revelation_code')
      .eq('id', bookingId)
      .single()

    if (existing?.revelation_code) {
      console.log(`Booking ${bookingId} already has code: ${existing.revelation_code}`)
      return existing.revelation_code
    }

    // Generate new unique code
    const code = await generateUniqueRevelationCode()

    // Assign to booking
    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ revelation_code: code })
      .eq('id', bookingId)

    if (error) {
      console.error('Error assigning revelation code:', error)
      return null
    }

    console.log(`✅ Revelation code ${code} assigned to booking ${bookingId}`)
    return code
  } catch (error) {
    console.error('Error in assignRevelationCode:', error)
    return null
  }
}

/**
 * Get bookings that need revelation codes sent (48h before departure)
 */
export async function getBookingsNeedingRevelation(): Promise<any[]> {
  try {
    const now = new Date()
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000)
    const in49Hours = new Date(now.getTime() + 49 * 60 * 60 * 1000)

    // Get confirmed bookings starting in 48-49 hours that don't have code yet
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        id,
        booking_number,
        start_date,
        email,
        first_name,
        last_name,
        theme,
        revelation_code,
        destination_id,
        destinations (
          name,
          region,
          description
        )
      `)
      .eq('status', 'confirmed')
      .gte('start_date', in48Hours.toISOString().split('T')[0])
      .lte('start_date', in49Hours.toISOString().split('T')[0])

    if (error) {
      console.error('Error fetching bookings for revelation:', error)
      return []
    }

    return bookings || []
  } catch (error) {
    console.error('Error in getBookingsNeedingRevelation:', error)
    return []
  }
}

/**
 * Process revelation codes for all eligible bookings
 * Returns number of codes generated and emails sent
 */
export async function processRevelationCodes(): Promise<{
  processed: number
  generated: number
  sent: number
  errors: string[]
}> {
  const result = {
    processed: 0,
    generated: 0,
    sent: 0,
    errors: [] as string[]
  }

  try {
    const bookings = await getBookingsNeedingRevelation()
    result.processed = bookings.length

    console.log(`📋 Found ${bookings.length} bookings needing revelation codes`)

    for (const booking of bookings) {
      try {
        // Generate code if not exists
        let code = booking.revelation_code

        if (!code) {
          code = await assignRevelationCode(booking.id)
          if (code) {
            result.generated++
          } else {
            result.errors.push(`Failed to generate code for booking ${booking.booking_number}`)
            continue
          }
        }

        // Send revelation email
        if (booking.email && booking.destinations) {
          try {
            const { sendRevelationEmail } = await import('@/lib/email')

            await sendRevelationEmail({
              to: booking.email,
              firstName: booking.first_name || 'Voyageur',
              bookingNumber: booking.booking_number,
              code,
              destination: booking.destinations.name,
              region: booking.destinations.region,
              startDate: booking.start_date,
              theme: booking.theme,
            })

            result.sent++
            console.log(`📧 Revelation email sent to ${booking.email} (Booking: ${booking.booking_number})`)
          } catch (emailError) {
            const errorMsg = `Failed to send email for booking ${booking.booking_number}: ${emailError}`
            console.error(errorMsg)
            result.errors.push(errorMsg)
          }
        } else {
          result.errors.push(
            `Missing email or destination for booking ${booking.booking_number}`
          )
        }
      } catch (error) {
        const errorMsg = `Error processing booking ${booking.booking_number}: ${error}`
        console.error(errorMsg)
        result.errors.push(errorMsg)
      }
    }

    console.log(`✅ Revelation processing complete:`, result)
    return result
  } catch (error) {
    console.error('Fatal error in processRevelationCodes:', error)
    result.errors.push(`Fatal error: ${error}`)
    return result
  }
}
