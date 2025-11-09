import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, constructWebhookEvent } from '@/lib/stripe'
import { updateBooking } from '@/lib/supabase'
import { sendBookingConfirmation } from '@/lib/email'

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
          // Update booking status to confirmed
          await updateBooking(bookingId, {
            status: 'confirmed',
          })

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
          await updateBooking(bookingId, {
            status: 'pending',
          })
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
