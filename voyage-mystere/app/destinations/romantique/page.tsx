import { Metadata } from 'next'
import { Heart } from 'lucide-react'
import { DestinationPage } from '@/components/destination-page'

export const metadata: Metadata = {
  title: 'Voyage Mystère Romantique | Voyage Mystère Premium',
  description: 'Évadez-vous à deux dans un cocon d\'amour : dîners aux chandelles, spa privatisé, hébergements d\'exception. À partir de 890€.',
}

const theme = {
  id: 'romantique',
  name: 'Romantique',
  emoji: '💕',
  icon: Heart,
  color: 'pink',
  tagline: 'Pour les amoureux en quête de moments intimes, de douceur et de magie à deux',
  description: 'Dîners aux chandelles, spas privatisés, hébergements d\'exception',
  longDescription: `Imaginez : une suite avec vue imprenable, un dîner aux chandelles dans un restaurant étoilé, un spa privatisé pour vous deux seuls, une balade main dans la main au coucher du soleil...

Nos destinations romantiques sont pensées pour créer des souvenirs inoubliables : demandes en mariage, anniversaires de couple, lune de miel ou simplement parce que vous méritez une parenthèse enchantée.`,
  examples: [
    'Villes d\'eau avec architecture médiévale',
    'Villages perchés au charme provençal',
    'Capitales européennes sous les étoiles',
    'Côtes sauvages avec hébergements face à l\'océan',
  ],
  includes: {
    title: '💎 Inclus dans la formule Romantique',
    items: [
      'Hébergement romantique (suite, chambre avec vue, ou lieu insolite)',
      '1 dîner gastronomique aux chandelles (restaurant sélectionné avec soin)',
      'Accès spa privatisé OU activité détente (massage duo, bain nordique...)',
      'Attention spéciale dans la chambre (champagne, pétales de roses, chocolats...)',
      'Carnet de voyage avec les adresses les plus romantiques',
      'Playlist Spotify "Romantic Getaway" offerte',
    ],
  },
  price: 890,
  upgrade: {
    title: 'Formule "Prestige Romantique"',
    price: 200,
    items: [
      'Upgrade suite prestige ou lieu d\'exception (château, villa privée...)',
      'Bouteille de champagne Veuve Clicquot',
      'Petit-déjeuner en chambre ou sur terrasse privée',
      'Shooting photo couple par un photographe pro (30 min, 20 photos retouchées)',
    ],
  },
  testimonial: {
    quote: 'Pour nos 5 ans, j\'ai réservé un Voyage Mystère Romantique. Quand on a découvert qu\'on partait à Colmar, ma copine a pleuré de joie. Le dîner au bord de la Petite Venise, le spa, la chambre avec vue... TOUT était parfait. J\'ai même demandé leur aide pour organiser ma demande en mariage sur un pont (elle a dit OUI 💍). Merci Voyage Mystère pour ce moment magique !',
    author: 'Julien',
    location: 'Paris',
  },
}

export default function RomantiquePage() {
  return <DestinationPage theme={theme} />
}
