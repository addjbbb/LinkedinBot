import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const STRIPE_PRICE_IDS = {
  romantique: {
    base: process.env.NEXT_PUBLIC_STRIPE_PRICE_ROMANTIQUE!,
    prestige: process.env.NEXT_PUBLIC_STRIPE_PRICE_ROMANTIQUE_PRESTIGE!,
  },
  nature: {
    base: process.env.NEXT_PUBLIC_STRIPE_PRICE_NATURE!,
    aventure: process.env.NEXT_PUBLIC_STRIPE_PRICE_NATURE_AVENTURE!,
  },
  urbain: {
    base: process.env.NEXT_PUBLIC_STRIPE_PRICE_URBAIN!,
    foodie: process.env.NEXT_PUBLIC_STRIPE_PRICE_URBAIN_FOODIE!,
  },
  options: {
    champagne: process.env.NEXT_PUBLIC_STRIPE_PRICE_CHAMPAGNE!,
    photoshoot: process.env.NEXT_PUBLIC_STRIPE_PRICE_PHOTOSHOOT!,
    basket: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASKET!,
  },
}

export async function createCheckoutSession(params: {
  bookingId: string
  theme: string
  amount: number
  successUrl: string
  cancelUrl: string
  customerEmail?: string
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Voyage Mystère ${params.theme.charAt(0).toUpperCase() + params.theme.slice(1)}`,
            description: 'Week-end surprise tout compris',
            images: ['https://yourdomain.com/images/logo.png'],
          },
          unit_amount: params.amount * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: {
      bookingId: params.bookingId,
    },
    payment_intent_data: {
      metadata: {
        bookingId: params.bookingId,
      },
    },
  })

  return session
}

export async function createPaymentIntent(amount: number, metadata: Record<string, string>) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'eur',
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return paymentIntent
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

export async function constructWebhookEvent(body: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}
