'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

interface GoogleReviewsWidgetProps {
  placeId?: string
  className?: string
}

export function GoogleReviewsWidget({
  placeId = 'YOUR_GOOGLE_PLACE_ID', // À remplacer
  className = '',
}: GoogleReviewsWidgetProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState(4.8)
  const [totalReviews, setTotalReviews] = useState(127)

  useEffect(() => {
    // TODO: Fetch real reviews from Google Places API
    // For now, using mock data

    const mockReviews = [
      {
        author: 'Marie L.',
        rating: 5,
        text: 'Une expérience exceptionnelle ! Le mystère était parfaitement maintenu et la destination magnifique. Je recommande vivement !',
        time: '2024-11-01',
      },
      {
        author: 'Thomas D.',
        rating: 5,
        text: 'Concept original et très bien exécuté. Parfait pour un week-end romantique surprise.',
        time: '2024-10-28',
      },
      {
        author: 'Sophie M.',
        rating: 4,
        text: 'Très bonne expérience dans l\'ensemble. Seul petit bémol : le temps pluvieux !',
        time: '2024-10-20',
      },
    ]

    setReviews(mockReviews)
  }, [placeId])

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`google-reviews-widget ${className}`}>
      {/* Header with overall rating */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center gap-2">
          <img
            src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
            alt="Google"
            className="h-6"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-gray-900">{rating}</span>
            {renderStars(Math.round(rating))}
          </div>
          <p className="text-sm text-gray-600">
            Basé sur {totalReviews} avis Google
          </p>
        </div>
        <a
          href={`https://search.google.com/local/writereview?placeid=${placeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm text-primary-600 hover:text-primary-700 font-semibold"
        >
          Laisser un avis
        </a>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">{review.author}</p>
                {renderStars(review.rating)}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(review.time).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <p className="text-gray-700 text-sm">{review.text}</p>
          </div>
        ))}
      </div>

      {/* Link to all reviews */}
      <div className="mt-6 pt-6 border-t-2 border-gray-100 text-center">
        <a
          href={`https://search.google.com/local/reviews?placeid=${placeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
        >
          Voir tous les avis sur Google →
        </a>
      </div>
    </div>
  )
}

// Badge version - compact display
export function GoogleReviewsBadge({
  rating = 4.8,
  totalReviews = 127,
}: {
  rating?: number
  totalReviews?: number
}) {
  return (
    <a
      href="https://search.google.com/local/reviews?placeid=YOUR_GOOGLE_PLACE_ID"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
    >
      <img
        src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
        alt="Google"
        className="h-4"
      />
      <div className="flex items-center gap-1">
        <span className="font-bold text-gray-900">{rating}</span>
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm text-gray-600">({totalReviews})</span>
      </div>
    </a>
  )
}

/*
 * SETUP INSTRUCTIONS:
 *
 * 1. Create/Claim your Google Business Profile:
 *    https://www.google.com/business/
 *
 * 2. Get your Place ID:
 *    - Go to https://developers.google.com/maps/documentation/places/web-service/place-id
 *    - Use Place ID Finder
 *    - Search for your business
 *    - Copy the Place ID
 *
 * 3. Enable Google Places API:
 *    - Go to Google Cloud Console
 *    - Enable Places API
 *    - Create API key
 *    - Restrict API key to Places API
 *
 * 4. Add to .env.local:
 *    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-api-key
 *    NEXT_PUBLIC_GOOGLE_PLACE_ID=your-place-id
 *
 * 5. Replace 'YOUR_GOOGLE_PLACE_ID' above
 *
 * 6. To fetch real reviews, uncomment API call in useEffect
 */
