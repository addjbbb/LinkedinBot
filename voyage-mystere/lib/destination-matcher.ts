/**
 * Destination Matching Algorithm
 * Scores and assigns the best destination based on questionnaire responses
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client for destination matching
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface QuestionnaireResponses {
  occasion: string
  travelerStyle: string[]
  rhythm: string
  budget: string
  dietaryRestrictions: string[]
  mobility: string
  phobias: string[]
  visitedRegions: string[]
  maxDistance: number
  transportPreference: string
  accommodationType: string
  preferredTime: string
  desiredExperience: string
  musicPreference: string
}

interface Destination {
  id: string
  name: string
  theme: string
  region: string
  country: string
  description: string
}

interface ScoredDestination extends Destination {
  score: number
  matchReasons: string[]
}

/**
 * Calculate compatibility score between questionnaire and destination
 */
function calculateDestinationScore(
  destination: Destination,
  responses: QuestionnaireResponses,
  theme: string
): ScoredDestination {
  let score = 0
  const matchReasons: string[] = []

  // 1. Theme match (CRITICAL - 40 points)
  if (destination.theme === theme) {
    score += 40
    matchReasons.push(`Thème ${theme} correspondant`)
  } else {
    // Wrong theme = disqualified
    return { ...destination, score: -1000, matchReasons: ['Thème incompatible'] }
  }

  // 2. Region preferences (20 points)
  const regionNormalized = destination.region.toLowerCase()
  const hasVisited = responses.visitedRegions.some(visited =>
    regionNormalized.includes(visited.toLowerCase()) ||
    visited.toLowerCase().includes(regionNormalized)
  )

  if (!hasVisited) {
    score += 20
    matchReasons.push('Nouvelle région à découvrir')
  } else {
    score -= 10
    matchReasons.push('Région déjà visitée (pénalité)')
  }

  // 3. Traveler style match (15 points)
  // Match destination theme with traveler styles
  if (destination.theme === 'romantique') {
    if (responses.travelerStyle.includes('romantic')) {
      score += 10
      matchReasons.push('Style romantique parfait')
    }
    if (responses.travelerStyle.includes('chill')) {
      score += 5
      matchReasons.push('Ambiance détente')
    }
    if (responses.travelerStyle.includes('cultural')) {
      score += 5
      matchReasons.push('Richesse culturelle')
    }
  } else if (destination.theme === 'nature') {
    if (responses.travelerStyle.includes('nature')) {
      score += 10
      matchReasons.push('Amoureux de la nature')
    }
    if (responses.travelerStyle.includes('adventure')) {
      score += 7
      matchReasons.push('Esprit aventurier')
    }
    if (responses.travelerStyle.includes('chill')) {
      score += 3
      matchReasons.push('Calme et sérénité')
    }
  } else if (destination.theme === 'urbain') {
    if (responses.travelerStyle.includes('cultural')) {
      score += 10
      matchReasons.push('Richesse culturelle urbaine')
    }
    if (responses.travelerStyle.includes('foodie')) {
      score += 7
      matchReasons.push('Gastronomie urbaine')
    }
    if (responses.travelerStyle.includes('adventure')) {
      score += 3
      matchReasons.push('Découverte urbaine')
    }
  }

  // 4. Occasion match (10 points)
  if (destination.theme === 'romantique' &&
      ['romantic', 'proposal', 'anniversary'].includes(responses.occasion)) {
    score += 10
    matchReasons.push('Parfait pour l\'occasion')
  }

  // 5. Rhythm compatibility (5 points)
  if (destination.theme === 'nature' && responses.rhythm === 'relaxed') {
    score += 5
    matchReasons.push('Rythme paisible en nature')
  } else if (destination.theme === 'urbain' && responses.rhythm === 'intense') {
    score += 5
    matchReasons.push('Rythme dynamique en ville')
  } else if (responses.rhythm === 'balanced') {
    score += 3
    matchReasons.push('Équilibre activités/détente')
  }

  // 6. Accommodation preference (5 points)
  if (destination.theme === 'romantique' &&
      ['boutique', 'luxury'].includes(responses.accommodationType)) {
    score += 5
    matchReasons.push('Hébergement de charme')
  } else if (destination.theme === 'nature' &&
      ['unusual', 'cottage', 'bnb'].includes(responses.accommodationType)) {
    score += 5
    matchReasons.push('Hébergement authentique')
  } else if (destination.theme === 'urbain' &&
      ['boutique', 'luxury'].includes(responses.accommodationType)) {
    score += 5
    matchReasons.push('Hôtel urbain raffiné')
  }

  // 7. Phobias check (CRITICAL - deduct if incompatible)
  if (destination.theme === 'nature') {
    if (responses.phobias.includes('heights')) {
      score -= 15
      matchReasons.push('⚠️ Attention vertige en montagne')
    }
    if (responses.phobias.includes('animals')) {
      score -= 10
      matchReasons.push('⚠️ Présence possible d\'animaux')
    }
  }
  if (destination.theme === 'urbain' && responses.phobias.includes('crowds')) {
    score -= 10
    matchReasons.push('⚠️ Zones touristiques fréquentées')
  }

  // 8. Add randomness for variety (0-5 points)
  const randomBonus = Math.random() * 5
  score += randomBonus

  return {
    ...destination,
    score,
    matchReasons
  }
}

/**
 * Find the best destination match for a booking
 */
export async function matchDestination(
  theme: string,
  responses: QuestionnaireResponses
): Promise<{ destinationId: string; score: number; reasons: string[] } | null> {
  try {
    // Fetch all active destinations for the theme
    const { data: destinations, error } = await supabaseAdmin
      .from('destinations')
      .select('*')
      .eq('theme', theme)
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching destinations:', error)
      return null
    }

    if (!destinations || destinations.length === 0) {
      console.warn(`No active destinations found for theme: ${theme}`)
      return null
    }

    // Score all destinations
    const scoredDestinations = destinations.map(dest =>
      calculateDestinationScore(dest, responses, theme)
    )

    // Sort by score (highest first)
    scoredDestinations.sort((a, b) => b.score - a.score)

    // Return the best match
    const bestMatch = scoredDestinations[0]

    console.log('🎯 Destination Matching Results:')
    console.log(`Theme: ${theme}`)
    console.log(`Best Match: ${bestMatch.name} (Score: ${bestMatch.score.toFixed(2)})`)
    console.log(`Reasons:`, bestMatch.matchReasons)

    // Log all candidates for debugging
    console.log('\nAll Candidates:')
    scoredDestinations.forEach((dest, index) => {
      console.log(`  ${index + 1}. ${dest.name}: ${dest.score.toFixed(2)} points`)
    })

    if (bestMatch.score < 0) {
      console.warn('Best match has negative score - no good match found')
      return null
    }

    return {
      destinationId: bestMatch.id,
      score: bestMatch.score,
      reasons: bestMatch.matchReasons
    }
  } catch (error) {
    console.error('Error in matchDestination:', error)
    return null
  }
}

/**
 * Assign destination to a booking
 */
export async function assignDestinationToBooking(
  bookingId: string,
  destinationId: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ destination_id: destinationId })
      .eq('id', bookingId)

    if (error) {
      console.error('Error assigning destination to booking:', error)
      return false
    }

    console.log(`✅ Destination ${destinationId} assigned to booking ${bookingId}`)
    return true
  } catch (error) {
    console.error('Error in assignDestinationToBooking:', error)
    return false
  }
}
