import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, constructWebhookEvent } from '@/lib/stripe'
import { sendBookingConfirmation } from '@/lib/email'
import { createClient } from '@supabase/supabase-js'

// Admin client for webhook (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  try {
    // Verify webhook signature
    const event = constructWebhookEvent(body, signature)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const bookingId = session.metadata?.bookingId

        if (bookingId) {
          // Update booking status to confirmed (using admin client)
          const { error: updateError } = await supabaseAdmin
            .from('bookings')
            .update({
              status: 'confirmed',
              payment_status: 'paid',
              stripe_payment_intent_id: session.payment_intent as string
            })
            .eq('id', bookingId)

          if (updateError) {
            console.error('Failed to update booking status:', updateError)
          } else {
            console.log(`Booking ${bookingId} confirmed successfully`)
          }

          // Send confirmation email
          if (session.customer_details?.email) {
            await sendBookingConfirmation({
              to: session.customer_details.email,
              firstName: session.metadata?.firstName || 'Voyageur',
              bookingNumber: session.metadata?.bookingNumber || '',
              theme: session.metadata?.theme || '',
              startDate: session.metadata?.startDate || '',
              totalPrice: (session.amount_total || 0) / 100,
            })
          }
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.error('Payment failed:', paymentIntent.id)

        const bookingId = paymentIntent.metadata?.bookingId
        if (bookingId) {
          const { error } = await supabaseAdmin
            .from('bookings')
            .update({
              status: 'draft',
              payment_status: 'pending'
            })
            .eq('id', bookingId)

          if (error) {
            console.error('Failed to update booking after payment failure:', error)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
