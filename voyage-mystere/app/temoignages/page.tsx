import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardBody } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Témoignages - Ils ont osé la surprise | Voyage Mystère Premium',
  description: '500+ couples ont vécu l\'aventure Voyage Mystère. Découvrez leurs histoires, leurs réactions, et pourquoi ils recommandent à tous leurs amis.',
}

const testimonials = [
  {
    couple: 'Julie & Marc, 29 et 32 ans',
    location: 'Paris',
    theme: '💕 Romantique',
    destination: 'Annecy, Haute-Savoie',
    date: 'Juin 2024',
    rating: 5,
    quote: 'Le plus beau cadeau de nos 5 ans de couple !',
    text: `On ne savait PAS DU TOUT où on allait. J'avais juste répondu que j'aimais la gastronomie et les villes d'eau. Quand on a ouvert la boîte et vu "ANNECY", on a crié de joie !

Le weekend était PARFAIT : dîner au bord du lac, balade en bateau, spa le dernier jour. On en parle encore 6 mois après !

Pour le prix (920€ avec l'upgrade spa premium), c'était donné. On en a eu pour notre argent et bien plus. Julie en parle ENCORE. Elle a recommandé Voyage Mystère à 4 couples de notre entourage.

Si vous hésitez : FONCEZ. La surprise, l'émotion, les souvenirs... ça vaut de l'OR.`,
  },
  {
    couple: 'Emma & Lucas, 27 et 28 ans',
    location: 'Lyon',
    theme: '🌲 Nature',
    destination: 'Gorges du Verdon',
    date: 'Août 2024',
    rating: 5,
    quote: 'On a flippé jusqu\'au bout... et on ne regrette RIEN !',
    text: `On est plutôt du genre contrôle-freaks tous les deux (surtout moi, Emma 😅). L'idée de partir sans savoir où nous stressait un peu, on va pas mentir. Mais Lucas insistait : "Allez, on tente, ça va être fun !"

Résultat : MEILLEURE DÉCISION EVER.

Le suspense de recevoir la boîte fermée pendant 10 jours était déjà une aventure. On a fait des paris avec nos amis sur la destination (aucun de nous n'a trouvé).

L'activité kayak dans les gorges... les mots manquent. L'eau turquoise, les falaises immenses, le guide ultra-sympa qui nous a emmenés dans des coins secrets. On a même vu des vautours !

Honnêtement, on aurait jamais réussi à organiser un week-end aussi parfait nous-mêmes. Tout était pensé, fluide, sans prise de tête.

On recommande À FOND, même aux stressés comme nous. Lâcher prise, c'est libérateur !`,
  },
  {
    couple: 'Sophie & Thomas, 35 et 37 ans',
    location: 'Marseille',
    theme: '🏙️ Urbain',
    destination: 'Porto, Portugal',
    date: 'Octobre 2024',
    rating: 5,
    quote: 'Un cadeau d\'anniversaire de mariage inoubliable 💍',
    text: `Pour nos 10 ans de mariage, je (Sophie) cherchais LE cadeau qui marquerait le coup. Thomas est un grand voyageur, difficile à surprendre. Mais là... j'ai réussi ! 🎉

J'ai réservé en secret (formule Urbain), et j'ai demandé que la boîte soit livrée directement à son bureau pour une surprise totale. Quand il a reçu le colis mystérieux au boulot, il m'a appelée : "C'est quoi ce truc ?!"

Révélation : PORTO. Il a litéralement pleuré. C'est sa ville rêve depuis qu'il a vu un reportage il y a 5 ans.

On adore voyager mais on en avait marre des destinations "bateau". Voyage Mystère Urbain nous a emmenés à PORTO et on a K-I-F-F-É ! La visite street art était dingue, les pasteis de nata un délice, et le quartier Ribeira juste magique.

Le carnet de voyage avec toutes les adresses nous a fait découvrir des pépites (ce bar à porto sur les toits... wow). On recommande à tous nos potes !`,
  },
  {
    couple: 'Léa & Antoine, 31 et 33 ans',
    location: 'Toulouse',
    theme: '💕 Romantique',
    destination: 'Côte Basque',
    date: 'Mai 2024',
    rating: 5,
    quote: 'Ma demande en mariage était PARFAITE grâce à vous !',
    text: `J'ai contacté Voyage Mystère en secret pour organiser ma demande en mariage. Ils ont été INCROYABLES. Ils m'ont aidé à tout coordonner : le timing, le lieu (une plage au coucher du soleil), même le photographe caché !

Quand on a ouvert la boîte et découvert la Côte Basque, Léa était déjà aux anges. Elle ne se doutait de RIEN pour la suite.

Le dernier soir, sur la plage, je me suis mis à genoux... Elle a dit OUI ! Le photographe est sorti de nulle part, on a des photos magnifiques.

Voyage Mystère, c'est pas juste un voyage, c'est une EXPÉRIENCE. Ils rendent les moments importants encore plus magiques.`,
  },
  {
    couple: 'Clara & Hugo, 26 et 27 ans',
    location: 'Nantes',
    theme: '🌲 Nature',
    destination: 'Jura',
    date: 'Septembre 2024',
    rating: 5,
    quote: 'Notre première vraie aventure ensemble, inoubliable !',
    text: `On sortait ensemble depuis 1 an et on voulait un voyage qui marque le coup. Voyage Mystère Nature était parfait pour notre côté aventurier.

La révélation du Jura nous a trop excités ! On a fait de la via ferrata (première fois pour moi, Clara), découvert des cascades cachées, dormi dans une cabane perchée dans les arbres (trop stylé !).

Le carnet de voyage était super bien fait avec des randos adaptées à notre niveau. Le guide local nous a montré des endroits où même les habitants ne vont pas.

Ce qui nous a le plus marqué : le coucher de soleil depuis les crêtes du Jura. On était seuls au monde, avec une vue à 360°. On s'est promis de revenir.

Merci Voyage Mystère pour ce premier voyage inoubliable. On reviendra, c'est sûr !`,
  },
  {
    couple: 'Marine & Julien, 29 et 31 ans',
    location: 'Bordeaux',
    theme: '🏙️ Urbain',
    destination: 'Séville, Espagne',
    date: 'Avril 2024',
    rating: 5,
    quote: 'Une ville qu\'on rêvait de visiter depuis toujours !',
    text: `Quand on a ouvert la boîte et vu SÉVILLE, on n'en revenait pas. C'était notre destination de rêve !

Le food tour était incroyable : tapas, jamón, fino... On a goûté tellement de choses ! Notre guide Paco était passionné et drôle.

Le quartier Santa Cruz, la cathédrale, l'Alcázar... tout était magique. Et le soir, on a suivi les recommandations du carnet pour les bars à flamenco. On a même osé danser !

L'hébergement était dans un ancien palais rénové, avec un patio andalou. Le petit-déjeuner sur la terrasse avec vue sur les toits de Séville... un rêve.

Séville + la surprise + l'organisation parfaite = le combo gagnant. Bravo Voyage Mystère !`,
  },
]

export default function TemoignagesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
            500+ couples ont{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              osé la surprise
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12">
            Découvrez leurs histoires, leurs réactions, et pourquoi ils recommandent
            <br />
            Voyage Mystère à tous leurs amis.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">4.9/5</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">380</div>
              <div className="text-gray-600">Avis TrustPilot</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-gray-600">Recommandent à leurs amis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardBody className="p-8">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4">
                    <Quote className="w-12 h-12 text-primary-100" fill="currentColor" />
                  </div>

                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {testimonial.couple}
                        </h3>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                      <Badge variant="primary" size="sm">
                        {testimonial.theme}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{testimonial.destination}</span>
                      <span>•</span>
                      <span>{testimonial.date}</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl font-semibold text-gray-900 mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Full Text */}
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">{testimonial.text}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Prêt·e à écrire votre propre histoire ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Rejoignez les centaines de couples qui ont osé la surprise et ne regrettent rien !
          </p>
          <Link href="/reserver">
            <Button variant="secondary" size="xl">
              Réserver mon Voyage Mystère
            </Button>
          </Link>
          <p className="mt-6 text-sm text-primary-100">
            ✓ Paiement sécurisé • ✓ Annulation gratuite -30j • ✓ Satisfait ou remboursé
          </p>
        </div>
      </section>
    </div>
  )
}
