import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, Target, Trophy, Heart, Trees, Building2 } from 'lucide-react'
import { generatePageSEO, SITE_ORGANIZATION_SCHEMA, generateProductSchema } from '@/lib/seo'

export const metadata: Metadata = generatePageSEO({
  title: 'Voyage Mystère Premium - Week-end Surprise Haut de Gamme en France',
  description: 'Découvrez nos voyages surprise premium. Week-end mystère 2 nuits tout compris dès 700€. Destination révélée 48h avant. Romantique, Nature ou Urbain. Annulation gratuite.',
  path: '/',
})

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6 animate-slideUp">
              Votre prochaine aventure commence ici.
              <br />
              <span className="text-primary-600">Destination ?</span> Vous le saurez dans 48h ✨
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Week-end surprise haut de gamme pour couples aventuriers.
              Choisissez votre thème, répondez à 10 questions, et laissez-nous vous surprendre.
              <br />
              <strong>2 nuits tout compris dès 700€.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/reserver">
                <Button size="xl" className="shadow-2xl">
                  Réserver mon voyage mystère
                </Button>
              </Link>
              <Link href="/comment-ca-marche">
                <Button variant="secondary" size="xl">
                  Comment ça marche ? ↓
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Annulation gratuite -30j</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>500+ couples ravis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Voyage Mystère Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Pourquoi choisir un Voyage Mystère ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Parce que les plus beaux souvenirs naissent de l'imprévu. Offrez-vous (ou offrez)
              l'émotion unique d'une surprise qui dure : de l'attente excitante à la révélation
              magique, jusqu'au voyage inoubliable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                L'émotion de la surprise
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Recevez une mystérieuse boîte 10 jours avant. Ouvrez-la 48h avant le départ
                avec un code secret. Vivez l'émerveillement de la découverte ensemble.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-6">
                <Target className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                100% personnalisé
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Grâce à notre questionnaire intelligent, nous créons LE voyage qui vous ressemble :
                vos goûts, votre rythme, vos envies. La surprise, pas le hasard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-6">
                <Trophy className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                Tout est inclus
              </h3>
              <p className="text-gray-600 leading-relaxed">
                2 nuits en hébergement d'exception, petits-déjeuners, 1 activité signature,
                carnet de voyage personnalisé. Vous n'avez qu'à profiter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Comment fonctionne la magie ?
            </h2>
            <p className="text-lg text-gray-600">
              En 3 étapes simples, créez l'aventure surprise parfaite
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
                  Je choisis & je personnalise
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  Sélectionnez votre thématique (Romantique, Nature ou Urbain), vos dates,
                  et répondez à 10 questions pour personnaliser votre surprise.
                </p>
                <span className="text-sm text-gray-500">⏱️ 5 minutes</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
                  Je reçois la boîte mystère
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  10 jours avant le départ, recevez une jolie boîte scellée chez vous.
                  Interdiction formelle de l'ouvrir ! (Oui, c'est dur 😅)
                </p>
                <span className="text-sm text-gray-500">📦 J-10</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
                  La grande révélation
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  48h avant, recevez le CODE par email. Ouvrez la boîte ensemble et découvrez
                  votre destination + votre carnet de voyage personnalisé. Frissons garantis !
                </p>
                <span className="text-sm text-gray-500">🔑 J-2</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/comment-ca-marche">
              <Button variant="secondary" size="lg">
                Voir le processus en détail
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Nos Thématiques Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Quelle aventure vous ressemble ?
            </h2>
            <p className="text-lg text-gray-600">
              3 univers, des dizaines de destinations secrètes en France et Europe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Theme Romantique */}
            <Card hover className="relative">
              <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                Le plus demandé
              </div>
              <div className="h-56 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                <Heart className="w-24 h-24 text-pink-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">💕</span>
                  <h3 className="text-2xl font-heading font-semibold text-gray-900">
                    Romantique
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Évadez-vous à deux dans un cocon d'amour : dîners aux chandelles,
                  spa privatisé, hébergements d'exception.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-success-500">✓</span>
                    <span>Hébergement romantique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success-500">✓</span>
                    <span>1 dîner gastronomique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success-500">✓</span>
                    <span>Accès spa privatisé</span>
                  </li>
                </ul>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary-600">890€</span>
                  <span className="text-gray-500 text-sm">/ 2 personnes</span>
                </div>
                <Link href="/reserver?theme=romantique" className="block">
                  <Button className="w-full">
                    Découvrir
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Theme Nature */}
            <Card hover>
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                Aventuriers
              </div>
              <div className="h-56 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Trees className="w-24 h-24 text-green-600" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">🌲</span>
                  <h3 className="text-2xl font-heading font-semibold text-gray-900">
                    Nature
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Respirez le grand air ! Montagnes, lacs, forêts... Pour les couples
                  qui kiffent l'aventure et les panoramas.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-success-500">✓</span>
                    <span>Hébergement nature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success-500">✓</span>
                    <span>1 activité outdoor guidée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success-500">✓</span>
                    <span>Pique-nique terroir</span>
                  </li>
                </ul>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary-600">750€</span>
                  <span className="text-gray-500 text-sm">/ 2 personnes</span>
                </div>
                <Link href="/reserver?theme=nature" className="block">
                  <Button className="w-full">
                    Découvrir
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Theme Urbain */}
            <Card hover>
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                Culture & Foodie
              </div>
              <div className="h-56 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Building2 className="w-24 h-24 text-blue-600" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">🏙️</span>
                  <h3 className="text-2xl font-heading font-semibold text-gray-900">
                    Urbain
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Découvrez une ville européenne fascinante : musées secrets, street art,
                  food tour, bars à cocktails.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-success-500">✓</span>
                    <span>Hébergement urbain design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success-500">✓</span>
                    <span>1 visite guidée insolite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success-500">✓</span>
                    <span>Bon resto 50€</span>
                  </li>
                </ul>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary-600">820€</span>
                  <span className="text-gray-500 text-sm">/ 2 personnes</span>
                </div>
                <Link href="/reserver?theme=urbain" className="block">
                  <Button className="w-full">
                    Découvrir
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
            Prêt·e à vivre l'aventure ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez les centaines de couples qui ont osé la surprise.
            Réservez en 5 minutes, voyagez dans 30 jours.
          </p>
          <Link href="/reserver">
            <Button size="xl" variant="secondary" className="shadow-2xl">
              Réserver mon Voyage Mystère →
            </Button>
          </Link>
          <div className="flex flex-wrap justify-center gap-6 text-sm mt-8 opacity-75">
            <span>✓ Paiement sécurisé</span>
            <span>✓ Annulation gratuite -30j</span>
            <span>✓ Satisfait ou remboursé</span>
          </div>
        </div>
      </section>
    </div>
  )
}
