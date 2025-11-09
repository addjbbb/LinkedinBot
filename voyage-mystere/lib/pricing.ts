/**
 * Pricing configuration for all travel themes and options
 */

export const pricing = {
  // Base prices for each theme
  themes: {
    romantique: 890,
    nature: 750,
    urbain: 820,
  },

  // Optional upgrades
  options: {
    upgradeSuite: 150,
    champagne: 40,
    photoshoot: 150,
    basket: 45,
  },

  // Stripe prices (in cents - price * 100)
  stripe: {
    themes: {
      romantique: 89000,
      nature: 75000,
      urbain: 82000,
    },
    options: {
      upgradeSuite: 15000,
      champagne: 4000,
      photoshoot: 15000,
      basket: 4500,
    },
  },

  // Gift card amounts
  giftCards: {
    presets: [700, 900, 1200, 1500],
    min: 500,
    max: 2000,
  },

  // Shipping costs
  shipping: {
    digitalCard: 0,
    physicalCard: 15,
  },
}

export type Theme = keyof typeof pricing.themes
export type OptionKey = keyof typeof pricing.options

/**
 * Get theme price
 */
export function getThemePrice(theme: Theme): number {
  return pricing.themes[theme]
}

/**
 * Get option price
 */
export function getOptionPrice(option: OptionKey): number {
  return pricing.options[option]
}

/**
 * Calculate total price
 */
export function calculateTotal(
  theme: Theme,
  selectedOptions: Partial<Record<OptionKey, boolean>> = {}
): number {
  let total = getThemePrice(theme)

  Object.entries(selectedOptions).forEach(([key, isSelected]) => {
    if (isSelected) {
      total += getOptionPrice(key as OptionKey)
    }
  })

  return total
}

/**
 * Get Stripe price ID for theme
 * In production, these would be actual Stripe Price IDs
 */
export function getStripePriceId(theme: Theme): string {
  // These are placeholder IDs - replace with real Stripe Price IDs in production
  const priceIds = {
    romantique: 'price_romantique_890',
    nature: 'price_nature_750',
    urbain: 'price_urbain_820',
  }
  return priceIds[theme]
}
