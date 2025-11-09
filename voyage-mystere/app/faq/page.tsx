import { Metadata } from 'next'
import Link from 'next/link'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Mail, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - Questions fréquentes | Voyage Mystère Premium',
  description: 'Toutes les réponses à vos questions sur les Voyages Mystère : réservation, paiement, le mystère, annulation, et le voyage.',
}

const faqCategories = [
  {
    title: 'Réservation & Paiement',
    icon: '💳',
    questions: [
      {
        id: 'q1',
        title: 'Comment réserver un Voyage Mystère ?',
        content: `C'est ultra simple et rapide (5 min chrono) :

1. Cliquez sur "Réserver"
2. Choisissez votre thématique (Romantique, Nature, Urbain)
3. Sélectionnez vos dates dans le calendrier
4. Répondez au questionnaire de personnalisation (10 questions)
5. Entrez vos informations personnelles
6. Payez en toute sécurité (carte, PayPal, ou 3x sans frais)
7. Recevez votre confirmation par email !

Vous avez immédiatement accès à votre espace client pour suivre votre réservation.`,
      },
      {
        id: 'q2',
        title: 'Quels sont les moyens de paiement acceptés ?',
        content: `Nous acceptons :
✅ Cartes bancaires : Visa, Mastercard, American Express
✅ PayPal
✅ Paiement en 3 fois sans frais via Alma (à partir de 300€)
✅ Virement bancaire (sur demande, pour les entreprises)

Tous les paiements sont sécurisés via Stripe (certification PCI-DSS niveau 1). Vos données bancaires ne sont JAMAIS stockées sur nos serveurs.`,
      },
      {
        id: 'q3',
        title: 'Puis-je payer en plusieurs fois ?',
        content: `Oui ! À partir de 300€, vous pouvez payer en 3 fois sans frais via Alma.

Exemple pour un voyage à 900€ :
• 1er paiement : 300€ à la réservation
• 2e paiement : 300€ à J+30
• 3e paiement : 300€ à J+60

Aucuns frais cachés, aucun intérêt. C'est gratuit ! L'option apparaît automatiquement au moment du paiement si vous êtes éligible.`,
      },
      {
        id: 'q4',
        title: 'Est-ce que je reçois une facture ?',
        content: `Oui, automatiquement ! Dès votre paiement confirmé, vous recevez :
• Un email de confirmation avec récapitulatif
• Votre facture en PDF (téléchargeable aussi depuis votre espace client)

Besoin d'une facture au nom de votre entreprise ? Indiquez-le dans le formulaire de réservation (champ "Facturation entreprise").`,
      },
      {
        id: 'q5',
        title: 'Y a-t-il des frais cachés ?',
        content: `ZÉRO frais caché. JAMAIS.

Le prix affiché = le prix final. Il inclut :
✓ 2 nuits d'hébergement
✓ Petits-déjeuners
✓ 1 activité signature
✓ Carnet de voyage personnalisé
✓ Boîte mystère livrée chez vous
✓ Assistance 7j/7

❌ PAS inclus (et c'est clairement indiqué) :
• Transport jusqu'à la destination
• Déjeuners et dîners supplémentaires (sauf 1 dîner pour formule Romantique)
• Activités optionnelles en extra

Transparence totale, toujours.`,
      },
      {
        id: 'q6',
        title: 'Puis-je utiliser un code promo ?',
        content: `Oui ! Si vous avez un code promo, entrez-le dans le champ prévu au moment du récapitulatif de commande (juste avant le paiement).

Codes promos courants :
• BIENVENUE10 : -10% sur votre 1ère réservation (nouveau client)
• PARRAINAGE50 : -50€ si un ami vous a parrainé
• EARLYBIRD : -15% sur certaines dates en avant-première

Les codes ne sont pas cumulables. Abonnez-vous à la newsletter pour recevoir des offres exclusives !`,
      },
      {
        id: 'q7',
        title: 'Puis-je réserver pour plus de 2 personnes ?',
        content: `Nos formules standard sont pour 2 personnes (couple).

MAIS on peut adapter pour :
• 3 personnes (trio d'amis, couple + enfant...) → Supplément +150-250€ selon destination
• 4 personnes (2 couples, famille...) → On crée une offre sur-mesure

Contactez-nous via le chat ou par email (hello@voyagemystere.com) pour un devis personnalisé. On adore les demandes spéciales !`,
      },
      {
        id: 'q8',
        title: 'Peut-on réserver pour une date précise (anniversaire, St-Valentin...) ?',
        content: `Absolument ! C'est même très fréquent.

Notre calendrier de réservation affiche TOUTES les dates disponibles. Vous choisissez exactement quand partir.

💡 Conseils :
• Pour la Saint-Valentin (14 février) : Réservez minimum 1 mois à l'avance (très demandé !)
• Pour les ponts de mai : Réservez dès février
• Pour un anniversaire précis : Minimum 3-4 semaines de marge

Plus vous réservez tôt, plus vous avez de choix de destinations !`,
      },
      {
        id: 'q9',
        title: 'Que se passe-t-il si aucune date ne me convient ?',
        content: `On ouvre régulièrement de nouvelles dates ! Voici comment être alerté·e :

1. Cliquez sur "Être alerté·e des nouvelles dates" (en bas du calendrier)
2. Indiquez votre thématique préférée et période souhaitée (ex: "mai-juin")
3. On vous envoie un email dès qu'on ouvre des dates correspondantes

En général, on ouvre les dates 2-3 mois à l'avance. Par exemple, les dates de juin sont ouvertes en avril.`,
      },
      {
        id: 'q10',
        title: 'Puis-je offrir un Voyage Mystère à quelqu\'un ?',
        content: `Oui, c'est LE cadeau parfait ! 🎁

Vous avez 2 options :

Option 1 : Carte cadeau (recommandé)
→ Vous achetez une carte cadeau d'un montant (700-1500€)
→ Vous la personnalisez avec un message
→ Les bénéficiaires choisissent eux-mêmes leur thème, dates et répondent au questionnaire
→ Valable 12 mois

Option 2 : Réservation pour quelqu'un
→ Vous réservez le voyage (vous choisissez le thème et les dates)
→ Vous répondez au questionnaire en vous mettant à leur place
→ La boîte est livrée chez eux, c'est la surprise totale !`,
      },
    ],
  },
  {
    title: 'Le Mystère',
    icon: '🎭',
    questions: [
      {
        id: 'q11',
        title: 'Je ne connais VRAIMENT PAS DU TOUT la destination avant ?',
        content: `VRAIMENT pas ! C'est 100% mystère jusqu'à 48h avant le départ.

Voici ce que vous savez au moment de la réservation :
✅ La thématique (Romantique, Nature, Urbain)
✅ La période (vos dates choisies)
✅ La zone géographique LARGE (ex: "France" ou "Sud de l'Europe")
✅ Le mode de transport conseillé (voiture, train, avion)

❌ Ce que vous ne savez PAS :
• La destination exacte
• La ville ou région précise
• Le nom de l'hébergement

Tout est révélé 48h avant, quand vous ouvrez la boîte avec le code secret !`,
      },
      {
        id: 'q12',
        title: 'Puis-je avoir un indice ?',
        content: `Ah, la question qu'on nous pose le PLUS ! 😄

La réponse officielle : NON, aucun indice. C'est toute la magie de la surprise !

MAIS... dans la boîte mystère (que vous recevez J-10, fermée à clé), il y a parfois :
• Une carte de France/Europe avec une zone vaguement entourée
• Un objet symbolique (un sachet de lavande → Sud ? Un paquet de stroopwafels → Belgique ? 😏)
• Une carte postale vintage d'une région

Mais rien d'explicite ! Le fun, c'est de deviner, de faire des paris avec vos amis, de spéculer... Puis d'ouvrir la boîte et de hurler "AHHHH C'EST TROP COOOOL !" 🎉`,
      },
      {
        id: 'q13',
        title: 'Et si je devine la destination avant ?',
        content: `Franchement, chapeau ! 👏 Mais même si vous devinez, on parie que :

1. Vous n'êtes pas sûr·e à 100% → le doute ajoute du suspens
2. Vous ne connaissez pas l'hébergement exact → la surprise reste entière
3. Vous ne savez pas exactement ce qu'on a prévu → le carnet de voyage regorge de surprises

Et puis franchement, même si vous devinez "Je pense qu'on va dans le Verdon", le moment de l'ouverture de la boîte et de la CONFIRMATION reste magique.

En 500+ voyages, personne ne nous a jamais dit "J'ai deviné donc c'est nul". Au contraire : "J'espérais tellement que ce soit [destination], et C'EST ÇA, je suis trop heureux·se !"`,
      },
      {
        id: 'q14',
        title: 'Comment vous choisissez la destination pour moi ?',
        content: `On utilise un système de matching ultra-personnalisé :

1. Votre questionnaire (10 questions) : On analyse vos goûts, rythme, budget, contraintes

2. Notre base de données : On a référencé 50+ destinations avec leurs caractéristiques précises (type d'ambiance, niveau sportif, gastronomie, budget...)

3. L'algorithme + expertise humaine : Un algo pré-sélectionne 3-5 destinations compatibles. Notre équipe valide manuellement et choisit LA meilleure en fonction des disponibilités, de la période, et de nos coups de cœur

4. Personnalisation du contenu : Le carnet de voyage est créé spécifiquement pour vous (restos adaptés si vegan, randos faciles si débutants, etc.)

Résultat : 98% de nos voyageurs disent "C'était EXACTEMENT ce qu'il nous fallait !"`,
      },
      {
        id: 'q15',
        title: 'Les destinations changent souvent ?',
        content: `On a un "pool" d'environ 50 destinations testées et approuvées qu'on fait tourner.

Quelques fois par an, on :
• Ajoute de nouvelles pépites (3-5 nouvelles destinations/an)
• Retire des destinations si la qualité baisse (hébergement qui change de proprio, resto qui ferme...)
• Met à jour les carnets de voyage (nouvelles adresses, nouveaux spots)

Certaines destinations sont "permanentes" (ex: Annecy, Porto, Verdon...) car ce sont des valeurs sûres ultra-fiables. D'autres sont saisonnières (ex: montagne l'hiver pour le ski).

Mais promis, TOUTES nos destinations sont des pépites. On refuse la médiocrité !`,
      },
      {
        id: 'q16',
        title: 'C\'est possible de partir à l\'étranger ?',
        content: `Oui ! Environ 30% de nos destinations sont hors France :
• Portugal (Porto, Lisbonne, Algarve...)
• Espagne (Séville, Bilbao, Barcelone...)
• Belgique (Bruges, Gand...)
• Italie (Cinque Terre, Dolomites, Toscane...)
• Suisse (Valais, Grisons...)

Au moment de la réservation, vous choisissez :
☐ France uniquement (dès 700€)
☐ France + Europe (dès 800€)

Les destinations Europe impliquent souvent :
• Un trajet en avion low-cost (on vous donne toutes les infos 48h avant)
• Un budget légèrement supérieur (+100-150€)
• Parfois besoin d'un passeport/carte d'identité valide (on vous le précise)

Mais la magie du mystère reste la même ! 🌍`,
      },
      {
        id: 'q17',
        title: 'Qu\'est-ce que je mets dans ma valise si je ne sais pas où je vais ?',
        content: `Excellente question ! Voici comment on vous aide :

Au moment de la réservation : On vous donne des indications générales :
• "Prévoyez des vêtements de rando et de pluie" (thème Nature)
• "Tenue chic pour 1 dîner romantique" (thème Romantique)
• "Chaussures confortables pour marcher en ville" (thème Urbain)

48h avant le départ (avec le code) : Le carnet de voyage contient une section "Valise" ultra-précise :
• Météo prévue
• Type de tenues conseillées (décontracté, chic, sportif...)
• Équipements spécifiques si besoin (maillot de bain pour spa, chaussures de rando, veste coupe-vent...)
• Ce qu'on fournit sur place (peignoirs spa, matériel de rando...)

En gros : prévoyez large, et on vous dira exactement ce dont vous avez besoin 48h avant. Largement le temps de finaliser !`,
      },
      {
        id: 'q18',
        title: 'Et si j\'ai déjà visité la destination révélée ?',
        content: `Ça arrive, mais c'est RARE (moins de 2% des cas), grâce à notre questionnaire qui demande :

❓ "Quelles destinations / régions avez-vous déjà visitées en France / Europe ?"
→ Vous listez toutes les villes où vous êtes déjà allés
→ On les exclut automatiquement de la sélection

SI malgré tout ça arrive (ex: vous avez oublié de mentionner une ville), contactez-nous IMMÉDIATEMENT après l'ouverture de la boîte (dans les 2h).

On trouvera une solution :
• Changement de destination si c'est possible (selon dispo)
• Report sur un autre week-end avec nouvelle destination
• Remboursement partiel

Mais franchement, même si vous connaissez la ville, notre carnet de voyage révèle souvent des spots secrets que vous n'aviez JAMAIS vus. On a eu des retours : "On connaissait déjà Bordeaux mais vos adresses nous ont fait redécouvrir la ville !"`,
      },
      {
        id: 'q19',
        title: 'Le mystère, c\'est pas trop stressant ?',
        content: `On comprend l'appréhension ! Lâcher prise sur le contrôle, c'est pas évident pour tout le monde.

Voici pourquoi 99% de nos clients ADORENT (même les control-freaks) :

✅ Vous CHOISISSEZ le style : Romantique / Nature / Urbain → Déjà moins flippant !
✅ Vous personnalisez via le questionnaire : On connaît vos goûts, contraintes, phobies... C'est pas du 100% random.
✅ Vous avez 48h pour vous préparer : Largement suffisant pour valise, GPS, mood.
✅ Tout est organisé : Hébergement, activités, adresses... Vous n'avez qu'à suivre le carnet. Zéro stress logistique.
✅ On est joignables 7j/7 : Un pépin ? On est là.

💬 Témoignage : "Je suis une mega-control-freak, j'ai hésité pendant 3 semaines avant de réserver. Finalement, c'était la MEILLEURE décision ! Lâcher prise m'a permis de profiter à 200%. Mon copain a adoré me voir surprise pour une fois. 10/10, je recommande même aux stressés comme moi !" — Sarah, 32 ans`,
      },
      {
        id: 'q20',
        title: 'Vous avez déjà eu des "fails" / mauvaises surprises ?',
        content: `On va être 100% honnêtes : sur 500+ voyages organisés, on a eu 2-3 micro-couacs, mais ZÉRO désastre.

Notre promesse : si un truc cloche, on le gère ET on compense. Toujours.

Satisfaction client : 4.9/5 (sur 380 avis TrustPilot)`,
      },
    ],
  },
  {
    title: 'Annulation & Modification',
    icon: '📅',
    questions: [
      {
        id: 'q21',
        title: 'Puis-je annuler ma réservation ?',
        content: `Oui, selon les conditions suivantes :

📅 Plus de 30 jours avant le départ :
✅ Annulation gratuite, remboursement à 100%

📅 Entre 30 et 15 jours avant :
⚠️ Remboursement à 50% (on a déjà commandé la boîte, bloqué l'hébergement...)

📅 Moins de 15 jours avant :
❌ Non remboursable
Mais vous pouvez REPORTER les dates (1 fois, frais de gestion 50€)

Pour annuler : connectez-vous à votre espace client → "Gérer ma réservation" → "Annuler ou Reporter".

Délai de remboursement : 5-7 jours ouvrés sur votre moyen de paiement initial.`,
      },
      {
        id: 'q22',
        title: 'Puis-je modifier mes dates ?',
        content: `Oui, selon le timing :

Plus de 30 jours avant : Modification gratuite (dans la limite des disponibilités). Vous pouvez changer dates + thématique si besoin.

Entre 30 et 15 jours avant : Modification possible avec frais de 50€ (on a déjà commencé la préparation).

Moins de 15 jours avant : Modification impossible (la boîte est déjà envoyée, l'hébergement confirmé...). Mais annulation possible selon conditions ci-dessus.

Pour modifier : Espace client → "Modifier mes dates".`,
      },
      {
        id: 'q23',
        title: 'Et si on tombe malade juste avant ?',
        content: `Aïe, pas de bol ! Voici vos options :

1. Vous avez une assurance annulation voyage ?
   → Excellent ! Elle peut couvrir l'annulation pour maladie (certificat médical requis).
   → On vous fournit tous les docs nécessaires pour votre assureur.

2. Pas d'assurance ?
   → Moins de 15 jours avant = non remboursable, MAIS :
   → On peut reporter sur un autre week-end (frais 50€)
   → Validité : 12 mois pour utiliser votre crédit

💡 Conseil : Souscrivez une assurance annulation (30-50€ chez Chapka, ACS...) pour voyager l'esprit tranquille !`,
      },
      {
        id: 'q24',
        title: 'Puis-je transférer ma réservation à quelqu\'un d\'autre ?',
        content: `Oui, vous pouvez "offrir" votre réservation à un autre couple !

Comment faire :
1. Contactez-nous par email (hello@voyagemystere.com) ou chat
2. Donnez-nous les coordonnées du nouveau couple bénéficiaire
3. On transfère la réservation (gratuit si plus de 30j avant, sinon frais 30€)
4. Le nouveau couple reçoit un email et peut accéder à l'espace client
5. Ils devront re-répondre au questionnaire (pour personnaliser selon leurs goûts)

La boîte mystère sera envoyée à leur adresse !`,
      },
      {
        id: 'q25',
        title: 'Que se passe-t-il si Voyage Mystère annule mon voyage ?',
        content: `Ça peut arriver dans de très rares cas (météo extrême, hébergement fermé en urgence, restrictions sanitaires...).

Si on annule, vous avez 2 options :

Option 1 : Report
→ On vous propose 3 nouvelles dates au choix
→ Même thématique ou changement possible
→ Aucuns frais, tout est pris en charge

Option 2 : Remboursement
→ Remboursement à 100%, QUEL QUE SOIT le délai
→ + un bon d'achat de 50€ pour vos désagréments

On fera TOUJOURS tout pour éviter d'annuler (on a un plan B, C, D pour chaque destination !). Mais si ça arrive, on est ultra-réactifs et arrangeants.`,
      },
    ],
  },
  {
    title: 'Le Voyage',
    icon: '✈️',
    questions: [
      {
        id: 'q26',
        title: 'Comment je fais pour aller à la destination si je ne la connais que 48h avant ?',
        content: `On vous donne TOUTES les infos nécessaires dans le carnet de voyage !

Pour une destination en voiture (70% des cas) :
• Adresse GPS exacte de l'hébergement
• Itinéraire recommandé (route la plus rapide ou la plus jolie)
• Infos péages (combien ça coûte)
• Parkings sur place (gratuit ? payant ? à réserver ?)

Pour une destination en train :
• Gare de départ conseillée
• Gare d'arrivée
• Horaires à privilégier
• Où acheter les billets (Trainline, SNCF...)
• Comment aller de la gare à l'hébergement

💡 Conseil : Au moment de la réservation, on vous indique la distance approximative et le mode de transport recommandé. Vous pouvez anticiper (poser des congés, réserver une voiture de loc...) sans connaître la destination exacte.`,
      },
      {
        id: 'q27',
        title: 'Qu\'est-ce qui est vraiment inclus dans l\'hébergement ?',
        content: `INCLUS (payé par vous, dans le prix du voyage) :
✅ 2 nuits en hébergement sélectionné (3-4* ou équivalent charme)
✅ Tous les petits-déjeuners
✅ Accès à tous les équipements de l'hébergement (piscine, terrasse, parking...)
✅ Taxes de séjour
✅ Wifi, literie, serviettes, produits d'accueil

ACTIVITÉ SIGNATURE INCLUSE (selon formule) :
• Romantique : 1 dîner gastronomique + accès spa
• Nature : 1 activité outdoor guidée + pique-nique
• Urbain : 1 visite insolite + bon resto 50€

NON INCLUS :
❌ Transport jusqu'à la destination
❌ Déjeuners et dîners non mentionnés
❌ Activités optionnelles supplémentaires
❌ Boissons alcoolisées hors formule
❌ Dépenses personnelles (souvenirs, extras...)`,
      },
      {
        id: 'q28',
        title: 'Je peux ajouter une nuit supplémentaire ?',
        content: `Oui ! Beaucoup de clients prolongent le week-end.

Comment faire :
• Une fois la destination révélée (48h avant), vous connaissez l'hébergement
• Vous les contactez directement pour ajouter une 3e nuit (ou plus)
• Vous payez directement auprès d'eux

OU

• Vous nous contactez APRÈS l'ouverture de la boîte
• On se charge de la résa pour vous (frais de service 20€)

Tarif de la nuit supplémentaire : Environ 80-150€ la nuit (selon hébergement), petit-déjeuner inclus.`,
      },
      {
        id: 'q29',
        title: 'Que faire si j\'ai un problème pendant le voyage ?',
        content: `On est joignables 7j/7, même le week-end !

Contacts d'urgence (dans votre carnet de voyage) :
📧 Email : support@voyagemystere.com (réponse < 2h)
📱 WhatsApp : +33 6 XX XX XX XX (réponse < 30 min)
☎️ Téléphone : +33 1 XX XX XX XX (9h-20h, 7j/7)

Promis, on ne vous laissera JAMAIS galérer seul·e·s !`,
      },
      {
        id: 'q30',
        title: 'Puis-je partager mon expérience après le voyage ?',
        content: `ON ADORE ÇA ! Et on vous encourage à le faire 🥰

Après le voyage, vous recevez un email : "Comment s'est passé votre Voyage Mystère ?"

Vous pouvez :
✅ Laisser un avis texte (publié sur le site avec votre accord)
✅ Envoyer des photos (on adore les publier sur Instagram !)
✅ Envoyer une vidéo de votre réaction à l'ouverture de la boîte
✅ Noter votre expérience sur TrustPilot

En remerciement, on vous offre :
🎁 Un code parrainage : Vous gagnez 50€ par couple que vous recommandez
📸 Vos photos en haute qualité (si on les publie sur nos réseaux)

Vos témoignages sont notre meilleure pub et inspirent d'autres couples à oser la surprise. MERCI ! ❤️`,
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
            Questions fréquentes
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Toutes les réponses à vos questions sur les Voyages Mystère.
            <br />
            Si vous ne trouvez pas votre réponse, contactez-nous !
          </p>

          {/* Search - Placeholder for future implementation */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {faqCategories.map((category) => {
            const items: AccordionItem[] = category.questions.map((q) => ({
              id: q.id,
              title: q.title,
              content: (
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {q.content}
                </div>
              ),
            }))

            return (
              <div key={category.title}>
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="text-4xl">{category.icon}</span>
                  {category.title}
                </h2>
                <Accordion items={items} />
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Notre équipe est là pour vous aider !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contactez-nous par chat
            </Button>
            <Link href="mailto:hello@voyagemystere.com">
              <Button variant="secondary" size="lg">
                <Mail className="w-5 h-5 mr-2" />
                Envoyer un email
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Réponse sous 24h maximum !
          </p>
        </div>
      </section>

      {/* CTA to booking */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Toutes vos questions ont une réponse ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Il est temps de réserver votre aventure mystère !
          </p>
          <Link href="/reserver">
            <Button variant="secondary" size="xl">
              Réserver maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
