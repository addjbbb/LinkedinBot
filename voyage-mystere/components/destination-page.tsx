import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Badge } from './ui/badge'

export interface DestinationPageProps {
  theme: {
    id: string
    name: string
    emoji: string
    icon: React.ComponentType<{ className?: string }>
    color: string
    tagline: string
    description: string
    longDescription: string
    examples: string[]
    includes: {
      title: string
      items: string[]
    }
    price: number
    upgrade?: {
      title: string
      price: number
      items: string[]
    }
    testimonial: {
      quote: string
      author: string
      location: string
    }
  }
}

export function DestinationPage({ theme }: DestinationPageProps) {
  const Icon = theme.icon

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Icon className="w-20 h-20 md:w-24 md:h-24 mx-auto text-primary-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
            {theme.emoji} Voyages Mystère {theme.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">{theme.tagline}</p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {theme.longDescription}
            </p>
          </div>

          {/* Examples */}
          <div className="mt-12">
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">
              Ce qui vous attend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {theme.examples.map((example, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{example}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div className="mt-12">
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">
              {theme.includes.title}
            </h3>
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8">
              <div className="space-y-4">
                {theme.includes.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t-2 border-primary-200">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  À partir de {theme.price}€
                </div>
                <p className="text-gray-600">
                  Pour 2 personnes, 2 nuits tout compris
                </p>
              </div>
            </div>
          </div>

          {/* Upgrade Option */}
          {theme.upgrade && (
            <div className="mt-12">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8" />
                  <h3 className="text-2xl font-display font-bold">
                    {theme.upgrade.title} (+{theme.upgrade.price}€)
                  </h3>
                </div>
                <ul className="space-y-3">
                  {theme.upgrade.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-accent-200">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Testimonial */}
          <div className="mt-12">
            <div className="bg-gray-100 rounded-2xl p-8">
              <div className="flex gap-2 mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <blockquote className="text-lg text-gray-800 italic mb-6">
                "{theme.testimonial.quote}"
              </blockquote>
              <p className="text-gray-600 font-medium">
                — {theme.testimonial.author}, {theme.testimonial.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Prêt·e à vivre cette aventure {theme.name.toLowerCase()} ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Réservez en 5 minutes, voyagez dans 30 jours
          </p>
          <Link href="/reserver">
            <Button
              variant="secondary"
              size="xl"
              className="mb-6"
            >
              Réserver un Voyage {theme.name}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-100">
            <span>✓ Paiement sécurisé</span>
            <span>✓ Annulation gratuite -30j</span>
            <span>✓ Satisfait ou remboursé</span>
          </div>
        </div>
      </section>
    </div>
  )
}
