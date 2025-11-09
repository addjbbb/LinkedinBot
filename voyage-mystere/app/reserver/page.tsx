import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardBody } from '@/components/ui/card'
import { Heart, Trees, Building2, ArrowRight, Calendar, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Réserver votre Voyage Mystère | Voyage Mystère Premium',
  description: 'Réservez votre week-end surprise en 5 minutes. Choisissez votre thématique, vos dates, et laissez-nous créer l\'aventure parfaite pour vous.',
}

const themes = [
  {
    id: 'romantique',
    name: 'Romantique',
    emoji: '💕',
    icon: Heart,
    tagline: 'Pour les amoureux',
    description: 'Dîners aux chandelles, spas privatisés, hébergements d\'exception',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
    price: 890,
    includes: ['Suite romantique', 'Dîner gastronomique', 'Accès spa privatisé', 'Champagne'],
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌲',
    icon: Trees,
    tagline: 'Pour les aventuriers',
    description: 'Randonnées, kayak, panoramas à couper le souffle',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
    price: 750,
    includes: ['Chalet cosy', 'Activité outdoor guidée', 'Pique-nique terroir', 'Carte randos'],
  },
  {
    id: 'urbain',
    name: 'Urbain',
    emoji: '🏙️',
    icon: Building2,
    tagline: 'Pour les curieux',
    description: 'Musées secrets, street art, food tours, bars à cocktails',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    price: 820,
    includes: ['Boutique hotel', 'Visite guidée insolite', 'Guide des adresses', 'Bon resto 50€'],
  },
]

export default function ReserverPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-16 h-16 mx-auto text-primary-500 mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
            Réservez votre{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              Voyage Mystère
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            En 5 minutes, créez l\'aventure surprise parfaite.
            <br />
            Choisissez votre thématique, vos dates, et laissez-nous vous surprendre.
          </p>
        </div>
      </section>

      {/* Steps Overview */}
      <section className="py-12 bg-white border-b-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: 1, title: 'Thématique' },
              { num: 2, title: 'Dates' },
              { num: 3, title: 'Questionnaire' },
              { num: 4, title: 'Informations' },
              { num: 5, title: 'Paiement' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold mb-2">
                  {step.num}
                </div>
                <div className="text-sm font-medium text-gray-700">{step.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Selection */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Étape 1 : Choisissez votre thématique
            </h2>
            <p className="text-lg text-gray-600">
              Quelle aventure vous ressemble ? La destination exacte reste secrète jusqu\'à 48h avant !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {themes.map((theme) => {
              const Icon = theme.icon
              return (
                <Card key={theme.id} hover className="relative overflow-hidden group">
                  {/* Header with Icon */}
                  <div className={`h-48 ${theme.bgColor} flex items-center justify-center transition-transform group-hover:scale-105`}>
                    <Icon className="w-24 h-24 text-gray-600" strokeWidth={1.5} />
                  </div>

                  <CardBody className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{theme.emoji}</div>
                      <h3 className="text-2xl font-display font-bold text-gray-900 mb-1">
                        {theme.name}
                      </h3>
                      <p className="text-sm text-primary-600 font-medium">{theme.tagline}</p>
                    </div>

                    <p className="text-gray-700 text-center mb-6">{theme.description}</p>

                    <div className="space-y-2 mb-6">
                      <div className="text-sm font-semibold text-gray-900 mb-2">Inclus :</div>
                      {theme.includes.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-600">• {item}</div>
                      ))}
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-gray-900">
                        À partir de {theme.price}€
                      </div>
                      <div className="text-sm text-gray-600">2 personnes • 2 nuits</div>
                    </div>

                    <Link href={`/reserver/dates?theme=${theme.id}`}>
                      <Button
                        variant="primary"
                        className="w-full"
                        size="lg"
                      >
                        Choisir {theme.name}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Reassurance */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Calendar className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Annulation gratuite -30j</h3>
              <p className="text-sm text-gray-600">Changez d\'avis sans frais</p>
            </div>
            <div>
              <Sparkles className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">100% personnalisé</h3>
              <p className="text-sm text-gray-600">Grâce à notre questionnaire</p>
            </div>
            <div>
              <Heart className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Satisfait ou remboursé</h3>
              <p className="text-sm text-gray-600">Notre garantie qualité</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">
            Questions avant de réserver ?
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                Je ne connais vraiment pas la destination avant ?
              </h3>
              <p className="text-gray-700">
                Exactement ! C\'est 100% mystère jusqu\'à 48h avant le départ. Vous connaissez uniquement la thématique et la zone géographique large. Tout le reste est révélé quand vous ouvrez la boîte avec le code secret.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                C\'est vraiment personnalisé ?
              </h3>
              <p className="text-gray-700">
                À 200% ! Après avoir choisi votre thématique, vous répondrez à un questionnaire de 15 questions pour que nous adaptions TOUT : destination, hébergement, activités, et recommandations de restos selon VOS goûts.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                Qu\'est-ce qui est inclus dans le prix ?
              </h3>
              <p className="text-gray-700">
                2 nuits d\'hébergement, petits-déjeuners, 1 activité signature, carnet de voyage personnalisé, boîte mystère livrée chez vous, et assistance 7j/7. Seul le transport jusqu\'à la destination n\'est pas inclus (révélé 48h avant).
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/faq">
              <Button variant="ghost" size="lg">
                Voir toutes les questions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
