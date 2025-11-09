import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Package, Check, Gift, Heart, Calendar, Cake, ChristmasTree, Building2, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Offrir un Voyage Mystère - Carte Cadeau | Voyage Mystère Premium',
  description: 'Offrez le cadeau qu\'ils n\'oublieront jamais. Carte cadeau digitale ou physique pour un week-end surprise inoubliable. Valable 12 mois.',
}

const formats = [
  {
    id: 'digital',
    name: 'Carte Digitale',
    icon: Mail,
    emoji: '💌',
    price: 0,
    advantages: [
      'Envoi immédiat par email',
      '100% personnalisable (message, visuel, date)',
      'Gratuit (aucuns frais de livraison)',
      'Écologique (zéro déchet)',
    ],
    recommended: 'Parfait pour dernière minute',
  },
  {
    id: 'physical',
    name: 'Carte Physique',
    icon: Package,
    emoji: '📦',
    price: 15,
    advantages: [
      'Jolie boîte cadeau premium',
      'Carte imprimée personnalisée',
      'Livret explicatif + petites attentions',
      'Effet "cadeau physique" garanti',
    ],
    recommended: 'Idéal pour Noël, anniversaire, mariage',
  },
]

const amounts = [
  { value: 700, label: '700€', description: 'Formule Nature standard', occasion: 'Cadeau d\'anniversaire' },
  { value: 900, label: '900€', description: 'Formule Romantique', occasion: 'Cadeau de mariage', popular: true },
  { value: 1200, label: '1 200€', description: 'Formule Premium', occasion: 'Cadeau exceptionnel' },
  { value: 1500, label: '1 500€', description: 'Formule Prestige', occasion: 'Cadeau VIP' },
]

const occasions = [
  {
    icon: Gift,
    title: 'Cadeau de Mariage',
    description: 'Offrez aux jeunes mariés un week-end surprise inoubliable. Bien mieux qu\'un grille-pain !',
    amount: '900-1200€',
  },
  {
    icon: Heart,
    title: 'Anniversaire de Couple',
    description: '1 an, 5 ans, 10 ans... Marquez le coup avec une aventure surprise qui ravivera la flamme.',
    amount: '750-900€',
  },
  {
    icon: Cake,
    title: 'Anniversaire (Individuel)',
    description: 'Pour les 30, 40, 50 ans de quelqu\'un qui a déjà tout : offrez de l\'émotion, pas un objet.',
    amount: '700-1000€',
  },
  {
    icon: ChristmasTree,
    title: 'Noël / Fêtes',
    description: 'Le cadeau sous le sapin qui fera hurler de joie. La carte physique est parfaite pour l\'effet surprise.',
    amount: '800-1200€',
  },
  {
    icon: Building2,
    title: 'Cadeau d\'Entreprise',
    description: 'Récompensez vos meilleurs employés, clients VIP, ou partenaires avec un cadeau unique.',
    amount: '1000-1500€',
  },
  {
    icon: Sparkles,
    title: 'Juste Parce Que',
    description: 'Pas besoin d\'occasion spéciale pour faire plaisir. "Je t\'offre un voyage mystère parce que je t\'aime."',
    amount: 'Libre',
  },
]

const why = [
  {
    title: 'Original & Inoubliable',
    description: 'Fini les cadeaux qui prennent la poussière. Offrez une EXPÉRIENCE, des souvenirs, de l\'émotion. Un voyage qu\'ils raconteront pendant 10 ans.',
  },
  {
    title: 'Ils choisissent ce qui leur plaît',
    description: 'Avec la carte cadeau, ils choisissent eux-mêmes la thématique (Romantique, Nature, Urbain), les dates qui leur conviennent, et leurs préférences via le questionnaire. Vous offrez la magie, ils personnalisent l\'aventure.',
  },
  {
    title: 'Flexible & Sans prise de tête',
    description: 'Valable 12 mois (ils partent quand ils veulent) • Montant de votre choix (700-1500€) • Livraison digitale instantanée OU boîte physique luxe en 3-5j',
  },
  {
    title: 'Effet WOW garanti',
    description: 'Imaginez leur tête quand ils reçoivent une jolie boîte avec : "Vous partez en Voyage Mystère ! Destination secrète révélée 48h avant le départ." C\'est le cadeau qui surprend DEUX FOIS : à la réception, et à la révélation !',
  },
]

export default function OffrirPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🎁</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
            Offrez le cadeau qu'ils{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              n'oublieront jamais
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Mariage, anniversaire, Noël, ou juste pour faire plaisir : la Carte Cadeau Voyage Mystère
            <br />
            est LE cadeau parfait pour les couples aventuriers.
          </p>
        </div>
      </section>

      {/* Why Offer */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900 mb-12">
            Pourquoi c'est le cadeau idéal ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {why.map((item, idx) => (
              <div key={idx} className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900 mb-12">
            Choisissez votre format
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {formats.map((format) => {
              const Icon = format.icon
              return (
                <Card key={format.id} hover className="relative">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold text-gray-900">
                          {format.emoji} {format.name}
                        </h3>
                        {format.price === 0 ? (
                          <p className="text-success-600 font-semibold">Gratuit</p>
                        ) : (
                          <p className="text-gray-600">+{format.price}€</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="info" className="mb-4">{format.recommended}</Badge>
                  </CardHeader>

                  <CardBody>
                    <div className="space-y-3">
                      {format.advantages.map((adv, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{adv}</span>
                        </div>
                      ))}
                    </div>
                  </CardBody>

                  <CardFooter>
                    <Link href={`/offrir/${format.id}`} className="w-full">
                      <Button variant="primary" className="w-full">
                        Offrir une Carte {format.name}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Amounts */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900 mb-6">
            Quel montant offrir ?
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12">
            💡 Le montant moyen offert est de 900€. C'est le sweet spot pour un week-end vraiment mémorable !
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {amounts.map((amount) => (
              <div
                key={amount.value}
                className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                  amount.popular
                    ? 'border-accent-500 bg-accent-50 relative'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {amount.popular && (
                  <Badge variant="primary" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Le plus offert
                  </Badge>
                )}
                <div className="text-3xl font-bold text-gray-900 mb-2">{amount.label}</div>
                <div className="text-sm font-medium text-primary-600 mb-2">{amount.description}</div>
                <div className="text-sm text-gray-600">{amount.occasion}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-block p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-xl font-bold text-gray-900 mb-2">Montant Libre</div>
              <div className="text-gray-600">Min 500€ • Max 2000€</div>
              <div className="text-sm text-gray-500 mt-2">Vous choisissez précisément</div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900 mb-12">
            Pour quelle occasion offrir ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {occasions.map((occasion, idx) => {
              const Icon = occasion.icon
              return (
                <div key={idx} className="p-6 bg-white rounded-xl shadow-md">
                  <Icon className="w-12 h-12 text-primary-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{occasion.title}</h3>
                  <p className="text-gray-700 mb-4">{occasion.description}</p>
                  <div className="text-sm font-semibold text-primary-600">
                    Montant recommandé : {occasion.amount}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900 mb-12">
            Comment ça marche pour eux après ?
          </h2>
          <div className="space-y-6">
            {[
              { step: 1, title: 'Ils reçoivent la carte cadeau', desc: '"Wahou, je pars en Voyage Mystère ! 🎉"' },
              { step: 2, title: 'Ils activent le code', desc: 'Sur voyagemystere.com/activer → Voient le montant disponible' },
              { step: 3, title: 'Ils réservent leur voyage', desc: 'Choisissent thématique, dates, et répondent au questionnaire' },
              { step: 4, title: 'Ils valident (sans payer !)', desc: 'Le montant est automatiquement déduit' },
              { step: 5, title: 'Ils reçoivent la boîte mystère (J-10)', desc: 'Suspense et excitation jusqu\'à l\'ouverture !' },
              { step: 6, title: 'Ils partent à l\'aventure', desc: 'Ils vous envoient des photos pour vous remercier ❤️' },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Prêt·e à faire le plus beau des cadeaux ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Choisissez votre format et personnalisez votre carte cadeau
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/offrir/digital">
              <Button variant="secondary" size="xl">
                💌 Carte Digitale
              </Button>
            </Link>
            <Link href="/offrir/physical">
              <Button variant="secondary" size="xl">
                📦 Carte Physique
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-primary-100">
            Valable 12 mois • 100% personnalisable • Effet WOW garanti
          </p>
        </div>
      </section>
    </div>
  )
}
