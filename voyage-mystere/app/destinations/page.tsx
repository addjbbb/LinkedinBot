import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardFooter } from '@/components/ui/card'
import { Heart, Trees, Building2, ArrowRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Nos Destinations | Voyage Mystère Premium',
  description: '3 thématiques, des dizaines de destinations secrètes en France et en Europe. Romantique, Nature ou Urbain : quelle aventure vous ressemble ?',
}

const themes = [
  {
    id: 'romantique',
    name: 'Romantique',
    emoji: '💕',
    icon: Heart,
    tagline: 'Pour les amoureux en quête de moments intimes',
    description: 'Dîners aux chandelles, spas privatisés, hébergements d\'exception',
    badge: 'Le plus demandé',
    price: 890,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'from-pink-100 to-pink-200',
    includes: [
      'Suite romantique ou chambre avec vue',
      'Dîner gastronomique aux chandelles',
      'Accès spa privatisé ou massage duo',
      'Champagne et attentions spéciales',
    ],
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌲',
    icon: Trees,
    tagline: 'Pour les aventuriers du grand air',
    description: 'Randonnées, kayak, panoramas à couper le souffle',
    badge: 'Pour les aventuriers',
    price: 750,
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-100 to-green-200',
    includes: [
      'Chalet, cabane ou écolodge',
      'Activité outdoor guidée',
      'Pique-nique terroir',
      'Carte des randos secrètes',
    ],
  },
  {
    id: 'urbain',
    name: 'Urbain',
    emoji: '🏙️',
    icon: Building2,
    tagline: 'Pour les curieux et gourmands',
    description: 'Musées secrets, street art, food tours, bars à cocktails',
    badge: 'Culture & Foodie',
    price: 820,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-100 to-blue-200',
    includes: [
      'Hébergement urbain design',
      'Visite guidée insolite',
      'Guide des meilleures adresses',
      'Bon 50€ restaurant/bar local',
    ],
  },
]

const comparison = [
  {
    criteria: 'Ambiance',
    romantique: 'Intimité, douceur',
    nature: 'Aventure, grand air',
    urbain: 'Culture, gastronomie',
  },
  {
    criteria: 'Hébergement',
    romantique: 'Suite romantique, spa',
    nature: 'Chalet, écolodge',
    urbain: 'Boutique hotel',
  },
  {
    criteria: 'Activité incluse',
    romantique: 'Dîner gastro + spa',
    nature: 'Activité outdoor guidée',
    urbain: 'Visite insolite',
  },
  {
    criteria: 'Rythme',
    romantique: 'Slow, détente',
    nature: 'Actif, sportif',
    urbain: 'Balade, découverte',
  },
]

export default function DestinationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
            Quelle aventure mystère{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              vous ressemble
            </span>{' '}
            ?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            3 thématiques, des dizaines de destinations secrètes en France et en Europe.
            <br />
            Choisissez votre style, on s'occupe de la magie.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Voyage Mystère, c'est l'art de combiner <strong>VOTRE personnalité</strong> avec{' '}
            <strong>NOS destinations coup de cœur</strong>. Vous ne choisissez pas la ville,
            mais vous choisissez l'<strong>AMBIANCE</strong>.
          </p>
          <p className="text-lg md:text-xl text-gray-700">
            Et croyez-nous : c'est là que réside toute la magie.
          </p>
        </div>
      </section>

      {/* Themes Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {themes.map((theme) => {
              const Icon = theme.icon
              return (
                <Card key={theme.id} hover className="relative overflow-hidden">
                  {/* Icon Header */}
                  <div className={`h-48 bg-gradient-to-br ${theme.bgColor} flex items-center justify-center relative`}>
                    <Icon className="w-24 h-24 text-gray-600" strokeWidth={1.5} />
                    {theme.badge && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="primary">{theme.badge}</Badge>
                      </div>
                    )}
                  </div>

                  <CardBody>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                      {theme.emoji} {theme.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{theme.tagline}</p>
                    <p className="text-gray-700 mb-6">{theme.description}</p>

                    <div className="space-y-2 mb-6">
                      {theme.includes.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      À partir de {theme.price}€
                    </div>
                    <p className="text-sm text-gray-600">Pour 2 personnes, 2 nuits tout compris</p>
                  </CardBody>

                  <CardFooter>
                    <Link href={`/destinations/${theme.id}`} className="w-full">
                      <Button variant="primary" className="w-full">
                        En savoir plus
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900 mb-12">
            Toujours hésitant·e ? Comparez les formules
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-2 border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Critère</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    💕 Romantique
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    🌲 Nature
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    🏙️ Urbain
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{row.criteria}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{row.romantique}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{row.nature}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{row.urbain}</td>
                  </tr>
                ))}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Tarif dès</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-bold">890€</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-bold">750€</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-bold">820€</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center">
            <Link href="/reserver">
              <Button variant="ghost" size="lg">
                Je ne sais toujours pas, faites-moi passer le quiz !
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Prêt·e à choisir votre aventure ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {themes.map((theme) => (
              <Link key={theme.id} href={`/destinations/${theme.id}`}>
                <Button variant="secondary" size="lg">
                  {theme.emoji} {theme.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
