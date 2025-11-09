/**
 * Pricing configuration for all travel themes and options
 */

// Complete pricing data with theme details
export const PRICING = {
  romantique: {
    name: 'Romantique',
    basePrice: 890,
    baseInclusions: [
      'Hébergement de charme 2 nuits',
      'Petits-déjeuners inclus',
      'Une activité romantique',
      'Dîner aux chandelles',
      'Boîte mystère personnalisée',
      'Conciergerie 24/7',
    ],
    upgrade: {
      name: 'Prestige',
      description: 'Sublimez votre expérience avec notre formule Prestige',
      price: 200,
      includes: [
        'Suite avec vue panoramique',
        'Champagne et rose à l\'arrivée',
        'Dîner gastronomique 3 plats',
        'Massage duo 30 min',
        'Late check-out',
      ],
    },
  },
  nature: {
    name: 'Nature',
    basePrice: 750,
    baseInclusions: [
      'Hébergement écologique 2 nuits',
      'Petits-déjeuners bio',
      'Randonnée guidée',
      'Activité nature',
      'Boîte mystère personnalisée',
      'Conciergerie 24/7',
    ],
    upgrade: {
      name: 'Aventure',
      description: 'Vivez une expérience nature intense',
      price: 180,
      includes: [
        'Hébergement insolite premium',
        'Panier pique-nique gourmet',
        'Activité aventure supplémentaire',
        'Guide naturaliste privé',
        'Kit aventurier offert',
      ],
    },
  },
  urbain: {
    name: 'Urbain',
    basePrice: 820,
    baseInclusions: [
      'Hôtel boutique 2 nuits',
      'Petits-déjeuners',
      'Visite guidée de la ville',
      'Pass activités urbaines',
      'Boîte mystère personnalisée',
      'Conciergerie 24/7',
    ],
    upgrade: {
      name: 'Foodie',
      description: 'Pour les amateurs de gastronomie urbaine',
      price: 190,
      includes: [
        'Chambre avec vue city',
        'Brunch dans un lieu tendance',
        'Tour gastronomique guidé',
        'Dégustation chez un chef',
        'Carnet d\'adresses gourmandes',
      ],
    },
  },
  options: [
    {
      id: 'champagne',
      name: 'Bouteille de Champagne',
      description: 'Champagne premium à votre arrivée',
      price: 40,
      emoji: '🍾',
    },
    {
      id: 'photoshoot',
      name: 'Séance Photo',
      description: 'Photographe professionnel 1h + 20 photos retouchées',
      price: 150,
      emoji: '📸',
    },
    {
      id: 'basket',
      name: 'Panier Gourmand',
      description: 'Spécialités locales et produits du terroir',
      price: 45,
      emoji: '🧺',
    },
  ],
} as const

export type Theme = keyof Omit<typeof PRICING, 'options'>
export type ThemeKey = 'romantique' | 'nature' | 'urbain'

// Legacy export for compatibility
export const pricing = {
  themes: {
    romantique: PRICING.romantique.basePrice,
    nature: PRICING.nature.basePrice,
    urbain: PRICING.urbain.basePrice,
  },
  options: {
    upgradeSuite: 150,
    champagne: 40,
    photoshoot: 150,
    basket: 45,
  },
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
  giftCards: {
    presets: [700, 900, 1200, 1500],
    min: 500,
    max: 2000,
  },
  shipping: {
    digitalCard: 0,
    physicalCard: 15,
  },
}

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
 * Calculate total price including upgrade and options
 * Used in booking flow
 */
export function calculateTotalPrice(
  theme: ThemeKey,
  upgrade: string | null,
  selectedOptions: string[]
): number {
  const themeData = PRICING[theme]
  let total = themeData.basePrice

  // Add upgrade price if selected
  if (upgrade && themeData.upgrade) {
    total += themeData.upgrade.price
  }

  // Add selected options prices
  selectedOptions.forEach((optionId) => {
    const option = PRICING.options.find((opt) => opt.id === optionId)
    if (option) {
      total += option.price
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
