import { NextRequest, NextResponse } from 'next/server'
import { processRevelationCodes } from '@/lib/revelation-code'

/**
 * Cron Job Endpoint: Process Revelation Codes
 *
 * This endpoint should be called daily (or multiple times per day) to:
 * 1. Find bookings with start_date in 48h
 * 2. Generate unique revelation codes
 * 3. Send revelation emails with destination info
 *
 * Security: Protected by CRON_SECRET environment variable
 *
 * Usage:
 * - Vercel Cron: Configure in vercel.json
 * - GitHub Actions: Schedule workflow
 * - External: curl with Authorization header
 */

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('CRON_SECRET environment variable not set!')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const expectedAuth = `Bearer ${cronSecret}`

    if (authHeader !== expectedAuth) {
      console.warn('Unauthorized cron job attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🕐 Starting revelation code cron job...')

    // Process all eligible bookings
    const result = await processRevelationCodes()

    console.log('✅ Revelation code cron job completed:', result)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result: {
        bookingsProcessed: result.processed,
        codesGenerated: result.generated,
        emailsSent: result.sent,
        errors: result.errors,
      }
    })
  } catch (error) {
    console.error('❌ Fatal error in revelation code cron job:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}
