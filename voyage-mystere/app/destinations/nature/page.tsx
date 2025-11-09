import { Metadata } from 'next'
import { Trees } from 'lucide-react'
import { DestinationPage } from '@/components/destination-page'

export const metadata: Metadata = {
  title: 'Voyage Mystère Nature | Voyage Mystère Premium',
  description: 'Respirez le grand air ! Randonnées, kayak, via ferrata. Pour les couples qui kiffent l\'aventure et les panoramas à couper le souffle. À partir de 750€.',
}

const theme = {
  id: 'nature',
  name: 'Nature',
  emoji: '🌲',
  icon: Trees,
  color: 'green',
  tagline: 'Pour les aventuriers du grand air, les amoureux de panoramas et de sensations fortes',
  description: 'Randonnées, kayak, panoramas à couper le souffle',
  longDescription: `Forêts, montagnes, lacs, cascades... Vous êtes fait·e·s pour respirer l'air pur, randonner sur des sentiers secrets, et vous endormir bercé·e·s par le chant des oiseaux.

Nos destinations Nature sont sélectionnées pour leur beauté brute et leurs activités outdoor incroyables. Que vous soyez sportifs aguerris ou simples amateurs de balades, on adapte tout à votre niveau.`,
  examples: [
    'Parcs naturels régionaux méconnus',
    'Massifs montagneux avec lacs d\'altitude',
    'Gorges spectaculaires et rivières turquoise',
    'Forêts ancestrales et villages de caractère',
  ],
  includes: {
    title: '🥾 Inclus dans la formule Nature',
    items: [
      'Hébergement nature (chalet en bois, cabane, écolodge, refuge de charme...)',
      '1 activité outdoor guidée (rando, kayak, via ferrata, VTT, escalade... selon destination)',
      'Pique-nique terroir OU panier de produits locaux',
      'Carte détaillée des randonnées (facile, moyen, difficile)',
      'Carnet de voyage avec spots secrets (cascade cachée, point de vue panoramique...)',
      'Guide faune & flore de la région',
    ],
  },
  price: 750,
  upgrade: {
    title: 'Formule "Aventure +"',
    price: 150,
    items: [
      '2e activité outdoor (ex: rando le matin + kayak l\'après-midi)',
      'Hébergement premium (cabane dans les arbres, yourte de luxe...)',
      'Cours photo nature avec un pro local (2h)',
    ],
  },
  testimonial: {
    quote: 'On avait besoin de déconnecter après des mois de boulot intense. On a choisi Nature sans savoir où on allait. Résultat : les Gorges du Verdon ! On a fait du kayak dans une eau turquoise incroyable, dormi dans un chalet cosy, randonné jusqu\'à un point de vue à 360°. C\'était EXACTEMENT ce qu\'il nous fallait. Zéro regret, que du kiff !',
    author: 'Emma & Lucas',
    location: 'Lyon',
  },
}

export default function NaturePage() {
  return <DestinationPage theme={theme} />
}
