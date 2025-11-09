import { Metadata } from 'next'
import { Building2 } from 'lucide-react'
import { DestinationPage } from '@/components/destination-page'

export const metadata: Metadata = {
  title: 'Voyage Mystère Urbain | Voyage Mystère Premium',
  description: 'Découvrez une ville européenne fascinante : musées secrets, street art, food tour, bars à cocktails. Pour les couples curieux et gourmands. À partir de 820€.',
}

const theme = {
  id: 'urbain',
  name: 'Urbain',
  emoji: '🏙️',
  icon: Building2,
  color: 'blue',
  tagline: 'Pour les curieux, les gourmands et les amoureux de culture et d\'architecture',
  description: 'Musées secrets, street art, food tours, bars à cocktails',
  longDescription: `Vous vibrez pour les ruelles pavées, les musées secrets, le street art, les marchés locaux et les bars à cocktails perchés ? Nos city breaks mystère sont faits pour vous.

Découvrez des villes européennes fascinantes (ou des quartiers insoupçonnés de grandes villes françaises). Flânez, goûtez, photographiez, et rentrez la tête pleine de souvenirs urbains.`,
  examples: [
    'Capitales européennes au charme fou (Lisbonne, Porto, Bruges, Séville...)',
    'Villes françaises méconnues (Strasbourg, Bordeaux, Lille, Nantes...)',
    'Quartiers branchés de métropoles (Le Marais à Paris, Confluence à Lyon...)',
    'Villes portuaires avec ambiance maritime',
  ],
  includes: {
    title: '🍷 Inclus dans la formule Urbain',
    items: [
      'Hébergement urbain design (boutique hotel, appart\' cosy, hôtel de charme)',
      '1 visite guidée insolite (street art tour, food tour, visite historique décalée...)',
      'Guide ultra-complet des meilleures adresses (brunch, coffee shops, bars, restos)',
      'Bon d\'achat 50€ pour un restaurant ou bar local (à utiliser librement)',
      'Carte annotée avec parcours de balade conseillé',
      'Pass transport en commun (selon la ville)',
    ],
  },
  price: 820,
  upgrade: {
    title: 'Formule "Foodie Deluxe"',
    price: 180,
    items: [
      'Food tour privé (3h, dégustation 6-8 spécialités locales)',
      'Réservation dans restaurant tendance (on choisit selon vos goûts)',
      'Dégustation vins/bières locales avec sommelier',
    ],
  },
  testimonial: {
    quote: 'On adore voyager mais on en avait marre des destinations "bateau". Voyage Mystère Urbain nous a emmenés à PORTO et on a K-I-F-F-É ! La visite street art était dingue, les pasteis de nata un délice, et le quartier Ribeira juste magique. Le carnet de voyage avec toutes les adresses nous a fait découvrir des pépites (ce bar à porto sur les toits... wow). On recommande à tous nos potes !',
    author: 'Sophie & Thomas',
    location: 'Marseille',
  },
}

export default function UrbainPage() {
  return <DestinationPage theme={theme} />
}
