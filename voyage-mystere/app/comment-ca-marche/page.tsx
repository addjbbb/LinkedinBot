import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Target, Sparkles, CreditCard, Package, Key, PartyPopper, Plane, ArrowRight, Video } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comment ça marche ? | Voyage Mystère Premium',
  description: 'De votre réservation à la révélation magique : découvrez comment fonctionne un Voyage Mystère en 7 étapes simples.',
}

const steps = [
  {
    number: 1,
    icon: Target,
    title: 'Je choisis ma thématique & mes dates',
    subtitle: 'Réservation (5 minutes)',
    color: 'from-primary-500 to-primary-600',
    content: {
      intro: 'Rendez-vous sur notre page de réservation et commencez l\'aventure :',
      points: [
        {
          title: 'Choisissez votre thématique :',
          items: [
            'Romantique : pour les amoureux en quête de moments intimes',
            'Nature : pour les aventuriers du grand air',
            'Urbain : pour les curieux et gourmands',
          ],
        },
        {
          title: 'Sélectionnez vos dates :',
          items: [
            'Choisissez un week-end disponible (vendredi-dimanche ou samedi-lundi)',
            'Notre calendrier affiche les disponibilités en temps réel',
          ],
        },
        {
          title: 'Voyez le prix :',
          items: [
            'Transparent et tout inclus. Vous savez exactement ce que vous payez',
            'Options upgrade disponibles (suite prestige, champagne, photos pro...)',
          ],
        },
      ],
    },
  },
  {
    number: 2,
    icon: Sparkles,
    title: 'Je réponds au questionnaire magique',
    subtitle: 'Personnalisation (10 minutes)',
    color: 'from-accent-500 to-accent-600',
    content: {
      intro: 'C\'est LA clé d\'un voyage parfaitement personnalisé. Répondez à 15 questions ludiques :',
      points: [
        {
          items: [
            'Quelle est l\'occasion ? (Anniversaire, juste parce que, demande en mariage...)',
            'Vous êtes plutôt... ? (Aventuriers, gourmands, romantiques, culturels)',
            'Votre rythme idéal ? (Détente absolue, mix, action non-stop)',
            'Budget activités supplémentaires ? (On mange sur le pouce, bon restaurant, gastro)',
            'Contraintes ? (Allergies, mobilité, phobies)',
            'Et plein d\'autres questions fun !',
          ],
        },
      ],
      footer: '🔒 Vos données sont 100% confidentielles et utilisées uniquement pour personnaliser votre voyage.',
    },
  },
  {
    number: 3,
    icon: CreditCard,
    title: 'Je valide & je paie en toute sécurité',
    subtitle: 'Paiement sécurisé (2 minutes)',
    color: 'from-success-500 to-success-600',
    content: {
      intro: 'Récapitulatif de votre commande, puis paiement ultra-sécurisé via Stripe :',
      points: [
        {
          items: [
            'Carte bancaire (Visa, Mastercard, Amex)',
            'PayPal',
            'Paiement en 3x sans frais (à partir de 300€)',
          ],
        },
      ],
      reassurances: [
        '🔒 Paiement 100% sécurisé (SSL + Stripe)',
        '✓ Annulation gratuite jusqu\'à 30 jours avant',
        '✅ Garantie satisfait ou remboursé',
      ],
      confirmation: [
        'Email de confirmation avec récap complet',
        'Facture (PDF)',
        'Accès à votre espace client',
      ],
    },
  },
  {
    number: 4,
    icon: Package,
    title: 'Je reçois la mystérieuse boîte',
    subtitle: 'Livraison (J-10)',
    color: 'from-purple-500 to-purple-600',
    content: {
      intro: '10 jours avant votre départ, une jolie boîte scellée arrive chez vous par Colissimo.',
      points: [
        {
          title: '📦 Contenu de la boîte (fermée avec un cadenas à code) :',
          items: [
            'Votre carnet de voyage personnalisé (SCELLÉ !)',
            'Une carte de France/Europe avec un indice subtil',
            'Des petites attentions (sachets de thé, carte postale mystère...)',
            'La consigne : "N\'OUVREZ PAS AVANT D\'AVOIR REÇU LE CODE !"',
          ],
        },
      ],
      footer: '💡 Astuce : Certains couples organisent une soirée "ouverture de la boîte" avec amis/famille pour vivre la révélation ensemble (ouverture en visio).',
    },
  },
  {
    number: 5,
    icon: Key,
    title: 'Je reçois le code secret',
    subtitle: 'La révélation approche (J-2 à 18h)',
    color: 'from-yellow-500 to-yellow-600',
    content: {
      intro: '48 heures avant votre départ, à 18h précises, vous recevez :',
      points: [
        {
          title: '📧 UN EMAIL avec :',
          items: [
            'Le CODE à 4 chiffres pour ouvrir la boîte',
            'Un message : "Le moment est venu... 3, 2, 1, DÉCOUVREZ VOTRE DESTINATION !"',
            'Des conseils pour la suite (quoi mettre dans la valise, météo, infos pratiques)',
          ],
        },
        {
          title: '📱 UN SMS de rappel :',
          items: [
            '"Votre code Voyage Mystère est arrivé ! Ouvrez votre boîte et découvrez où vous partez demain 🎉"',
          ],
        },
      ],
      footer: '⏰ Pourquoi 18h ? Pour que vous ayez le temps de faire vos valises sereinement, de checker la météo, et de vous coucher excité·e·s comme des enfants la veille de Noël !',
    },
  },
  {
    number: 6,
    icon: PartyPopper,
    title: 'J\'ouvre la boîte... Frissons garantis !',
    subtitle: 'LE GRAND MOMENT',
    color: 'from-pink-500 to-pink-600',
    content: {
      intro: 'C\'est LE moment que vous attendiez depuis 10 jours.',
      points: [
        {
          title: '📹 On vous conseille :',
          items: [
            'Filmez-vous ! Immortalisez votre réaction (et partagez sur Insta avec #VoyageMystère)',
            'Vivez ce moment à deux, au calme, pour savourer pleinement',
            'Ayez votre téléphone pour googler la destination tout de suite 😄',
          ],
        },
        {
          title: '🎁 Ce que vous découvrez dans la boîte :',
          items: [
            '1. UNE GRANDE CARTE révélant votre destination - Ex: "Bienvenue à PORTO, la perle du Portugal !"',
            '2. Votre carnet de voyage ultra-personnalisé (40-60 pages) avec programme, hébergement, adresses...',
            '3. Vos vouchers/billets pour l\'hébergement et les activités',
            '4. Petites surprises (carte postale, goodies locaux, code promo parrainage)',
          ],
        },
      ],
      footer: '💬 Réaction typique : "OH MY GOD C\'EST [DESTINATION] !!! J\'AI TROP TROP ENVIE D\'Y ALLER !" (On a des centaines de vidéos de réactions, et ça nous fait vibrer à chaque fois ❤️)',
    },
  },
  {
    number: 7,
    icon: Plane,
    title: 'Je pars vivre l\'aventure !',
    subtitle: 'C\'est parti pour l\'aventure !',
    color: 'from-blue-500 to-blue-600',
    content: {
      intro: 'Le lendemain ou surlendemain, vous prenez la route/le train/l\'avion vers votre destination.',
      points: [
        {
          title: '🗺️ Votre carnet de voyage est votre meilleur ami :',
          items: [
            'Il contient TOUT : adresses, horaires, bons plans, astuces locales',
            'Vous n\'avez qu\'à suivre (ou improviser, c\'est vous qui voyez !)',
          ],
        },
        {
          title: '📱 Assistance 7j/7 :',
          items: [
            'Un souci ? Une question ? Notre équipe est joignable par WhatsApp, email ou tél',
            'On est là pour que tout soit parfait',
          ],
        },
        {
          title: '🏨 Check-in sans stress :',
          items: [
            'Tout est réservé, payé, confirmé',
            'Vous donnez votre nom, vous recevez vos clés, et c\'est parti !',
          ],
        },
      ],
      footer: '📸 Vivez à fond : Profitez de chaque instant. Prenez des photos. Goûtez les spécialités locales. Rigolez. Tombez (encore plus) amoureux·se.',
    },
  },
]

export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 animate-fadeIn">
            Comment fonctionne un{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              Voyage Mystère
            </span>{' '}
            ?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-slideUp">
            De votre réservation à la révélation magique : on vous explique tout en 7 étapes simples.
            <br />
            Préparez-vous à vivre une aventure que vous n'oublierez jamais.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="relative"
                >
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 md:left-12 top-24 md:top-28 w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent" />
                  )}

                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative">
                    {/* Icon & Number */}
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg relative z-10`}>
                        <Icon className="w-8 h-8 md:w-12 md:h-12 text-white" />
                      </div>
                      <div className="mt-4 text-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          {step.subtitle}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
                        {step.title}
                      </h2>

                      <p className="text-lg text-gray-700 mb-6">{step.content.intro}</p>

                      <div className="space-y-4">
                        {step.content.points.map((point, idx) => (
                          <div key={idx}>
                            {point.title && (
                              <h3 className="font-semibold text-gray-900 mb-2">{point.title}</h3>
                            )}
                            <ul className="space-y-2">
                              {point.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {step.content.reassurances && (
                        <div className="mt-6 space-y-2">
                          {step.content.reassurances.map((item, idx) => (
                            <p key={idx} className="text-sm font-medium text-success-700">
                              {item}
                            </p>
                          ))}
                        </div>
                      )}

                      {step.content.confirmation && (
                        <div className="mt-6">
                          <p className="font-semibold text-gray-900 mb-2">
                            Dès le paiement validé, vous recevez :
                          </p>
                          <ul className="space-y-1">
                            {step.content.confirmation.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-success-500">✓</span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.content.footer && (
                        <p className="mt-6 text-sm text-gray-600 italic bg-gray-50 p-4 rounded-lg">
                          {step.content.footer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Video className="w-12 h-12 text-primary-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Envie de voir le process en vidéo ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Découvrez le témoignage vidéo de Julie & Marc qui vous expliquent leur expérience de A à Z :
            de la réservation à la révélation, jusqu'au voyage à Annecy.
          </p>
          <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Vidéo à venir</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Prêt·e à vivre votre propre aventure ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Rejoignez les centaines de couples qui ont osé la surprise.
            <br />
            Réservez en 5 minutes, voyagez dans 30 jours.
          </p>
          <Link href="/reserver">
            <Button variant="secondary" size="xl" className="mb-6">
              Réserver mon Voyage Mystère
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
