// Google Analytics 4 integration

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Initialize GA
export const initGA = () => {
  if (!GA_TRACKING_ID) {
    console.warn('Google Analytics ID not found')
    return
  }

  // Load gtag.js script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script)

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_TRACKING_ID, {
    page_path: window.location.pathname,
    anonymize_ip: true, // GDPR compliance
  })
}

// Track page views
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID || typeof window.gtag === 'undefined') return

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// Track events
interface EventParams {
  action: string
  category: string
  label?: string
  value?: number
}

export const event = ({ action, category, label, value }: EventParams) => {
  if (!GA_TRACKING_ID || typeof window.gtag === 'undefined') return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// E-commerce events
export const trackPurchase = (params: {
  transaction_id: string
  value: number
  currency: string
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}) => {
  if (!GA_TRACKING_ID || typeof window.gtag === 'undefined') return

  window.gtag('event', 'purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency,
    items: params.items,
  })
}

export const trackBeginCheckout = (params: {
  value: number
  currency: string
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}) => {
  if (!GA_TRACKING_ID || typeof window.gtag === 'undefined') return

  window.gtag('event', 'begin_checkout', {
    value: params.value,
    currency: params.currency,
    items: params.items,
  })
}

export const trackAddToCart = (params: {
  item_id: string
  item_name: string
  price: number
}) => {
  if (!GA_TRACKING_ID || typeof window.gtag === 'undefined') return

  window.gtag('event', 'add_to_cart', {
    items: [{
      item_id: params.item_id,
      item_name: params.item_name,
      price: params.price,
      quantity: 1,
    }],
  })
}

// Custom events for booking flow
export const trackBookingStep = (step: number, stepName: string) => {
  event({
    action: 'booking_step',
    category: 'Booking',
    label: `Step ${step}: ${stepName}`,
    value: step,
  })
}

export const trackQuestionnaireComplete = () => {
  event({
    action: 'questionnaire_complete',
    category: 'Engagement',
    label: 'Questionnaire completed',
  })
}

export const trackRevealCodeOpened = () => {
  event({
    action: 'reveal_code_opened',
    category: 'Engagement',
    label: 'Mystery destination revealed',
  })
}

// Track newsletter signup
export const trackNewsletterSignup = () => {
  event({
    action: 'newsletter_signup',
    category: 'Engagement',
    label: 'Newsletter subscription',
  })
}

// Track form submissions
export const trackFormSubmit = (formName: string) => {
  event({
    action: 'form_submit',
    category: 'Forms',
    label: formName,
  })
}

// Track CTA clicks
export const trackCTAClick = (ctaName: string, location: string) => {
  event({
    action: 'cta_click',
    category: 'Engagement',
    label: `${ctaName} - ${location}`,
  })
}

// Track social share
export const trackSocialShare = (platform: string, page: string) => {
  event({
    action: 'social_share',
    category: 'Social',
    label: `${platform} - ${page}`,
  })
}

// Track search
export const trackSearch = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'Engagement',
    label: searchTerm,
  })
}

// Track errors
export const trackError = (errorMessage: string, errorLocation: string) => {
  event({
    action: 'error',
    category: 'Errors',
    label: `${errorLocation}: ${errorMessage}`,
  })
}
