# 🎯 PROCHAINES ÉTAPES - VOYAGE MYSTÈRE

> **Guide pour continuer le développement du site**

---

## ✅ CE QUI EST TERMINÉ

### Phase 1: Documentation & Architecture ✓

- ✅ Documentation complète (7 documents, 181 KB)
- ✅ Architecture du site (arborescence, parcours utilisateurs)
- ✅ Design system complet (couleurs, typographie, composants)
- ✅ Copywriting professionnel (toutes les pages)
- ✅ Stack technique recommandée (Next.js + Tailwind + Supabase + Stripe)
- ✅ Guide de maintenance (gérer le site sans dev)

### Phase 2: Code Next.js - Homepage ✓

- ✅ Projet Next.js 14 initialisé avec TypeScript
- ✅ Tailwind configuré avec design system complet
- ✅ Composants UI de base (Button, Card)
- ✅ Utilitaires (15+ fonctions helpers)
- ✅ Configuration pricing complète
- ✅ Homepage avec 5 sections et copywriting complet:
  - Hero section
  - Pourquoi Voyage Mystère
  - Comment ça marche (3 étapes)
  - Nos Thématiques (3 cards)
  - CTA final
- ✅ Responsive mobile-first
- ✅ Animations Tailwind
- ✅ SEO meta tags

**État actuel:** Homepage fonctionnelle, prête à `npm install && npm run dev`

---

## 🚀 SUITE DU DÉVELOPPEMENT

### Étape 3: Composants UI Manquants (2-3 heures)

**Créer dans `/components/ui/`:**

1. **Input.tsx** - Champs de formulaire
   ```tsx
   - Text, Email, Tel, Number inputs
   - Textarea
   - États: normal, focus, error, disabled
   - Validation visuelle
   ```

2. **Select.tsx** - Sélecteur dropdown
   ```tsx
   - Custom select avec Headless UI
   - Support clavier
   - Recherche si needed
   ```

3. **Checkbox.tsx & Radio.tsx**
   ```tsx
   - Styled inputs
   - Label intégré
   - États accessibles
   ```

4. **Modal.tsx** - Dialogues/Modals
   ```tsx
   - Overlay avec backdrop blur
   - Animation d'entrée/sortie
   - Focus trap
   - Escape pour fermer
   ```

5. **Accordion.tsx** - Pour FAQ
   ```tsx
   - Items expandables
   - Single ou multiple open
   - Animations smooth
   ```

6. **Badge.tsx** - Tags et badges
   ```tsx
   - Variantes: success, error, warning, info
   - Tailles: sm, md
   ```

7. **Alert.tsx & Toast.tsx** - Notifications
   ```tsx
   - 4 types: success, error, warning, info
   - Auto-dismiss pour toast
   - Icônes appropriées
   ```

**Ressources:**
- [Headless UI](https://headlessui.com/) pour Modal, Select, Accordion
- Design specs dans `docs/02-DESIGN-SYSTEM.md`

---

### Étape 4: Navigation & Footer (3-4 heures)

**Créer dans `/components/layout/`:**

1. **Navbar.tsx**
   ```tsx
   Logo | Comment ça marche | Destinations | Témoignages | Blog | [RÉSERVER]

   Mobile: Hamburger menu

   Features:
   - Sticky on scroll
   - Active link highlighting
   - Smooth scroll vers sections
   - Mobile responsive
   ```

2. **Footer.tsx**
   ```tsx
   5 colonnes:
   - Voyage Mystère (À propos, Comment ça marche, Contact...)
   - Destinations (Romantique, Nature, Urbain)
   - Aide (FAQ, CGV, Politique confidentialité)
   - Suivez-nous (Instagram, TikTok, Facebook, Pinterest)
   - Newsletter (formulaire email)

   Bottom: Paiement sécurisé, TrustPilot, Copyright
   ```

3. **MobileNav.tsx**
   ```tsx
   - Menu hamburger
   - Slide-in depuis droite
   - Overlay backdrop
   - Liens avec icônes
   ```

**Intégration:**
- Modifier `app/layout.tsx` pour ajouter Navbar et Footer
- Créer contexte pour état mobile menu

---

### Étape 5: Pages Statiques (5-6 heures)

#### Page "Comment ça marche" (`app/comment-ca-marche/page.tsx`)

**Sections:**
1. Hero
2. Process 7 étapes détaillées (voir `docs/03-COPYWRITING-COMPLET.md`)
3. Vidéo explicative (placeholder pour l'instant)
4. FAQ détaillée (5 questions)
5. CTA

**Composants spécifiques:**
- Timeline verticale avec numéros
- Illustrations/icons pour chaque étape

---

#### Pages Destinations (`app/destinations/`)

**Structure:**
```
app/destinations/
├── page.tsx              # Hub destinations
├── romantique/page.tsx   # Page Romantique
├── nature/page.tsx       # Page Nature
└── urbain/page.tsx       # Page Urbain
```

**Chaque page thématique:**
- Hero avec grande image
- Description longue
- Inclus (liste détaillée)
- Option upgrade
- Témoignage encadré
- Photos grid
- FAQ spécifique
- CTA réserver

**Copywriting:** Tout dans `docs/03-COPYWRITING-COMPLET.md`

---

#### Page FAQ (`app/faq/page.tsx`)

**Features:**
- Search bar (filtre client-side)
- 4 catégories (tabs ou sections)
- 30 questions en accordéon
- Schema markup FAQ pour SEO

**Questions:** `docs/04-FAQ-TEMOIGNAGES-OFFRIR.md`

---

#### Page Témoignages (`app/temoignages/page.tsx`)

**Features:**
- Filtres: thématique, date, note, format (vidéo/texte)
- Grid de cards témoignages
- Vidéos embedded (YouTube/Vimeo)
- Photos lightbox
- Pagination ou infinite scroll
- Stats en hero (4.9/5, 500+ couples...)

**Data:** Pour l'instant, hardcode 3-5 témoignages. Plus tard: fetch depuis Supabase

---

#### Page Offrir (`app/offrir/page.tsx`)

**Sections:**
1. Hero "Offrez le cadeau parfait"
2. Pourquoi offrir (4 raisons)
3. 2 formats (Digitale gratuite / Physique +15€)
4. Montants (4 presets + libre)
5. 6 occasions
6. Timeline utilisation
7. FAQ carte cadeau
8. CTA

**Fonctionnel:**
- Sélecteur format (radio buttons)
- Sélecteur montant (cards cliquables)
- Formulaire personnalisation (message, date envoi...)
- → Mène vers paiement Stripe (Étape 11)

---

### Étape 6: Blog Structure (2-3 heures)

**Structure:**
```
app/blog/
├── page.tsx                           # Liste articles
├── [slug]/page.tsx                    # Article individuel
└── layout.tsx                         # Layout blog (sidebar?)
```

**Page liste:**
- Grid articles (image + titre + extrait + date + author)
- Filtres par catégorie/tag
- Search

**Page article:**
- Hero image
- Titre H1
- Author, date, temps lecture
- Contenu (markdown ou rich text)
- Table of contents (sticky sidebar)
- Articles reliés
- CTA "Réserver"

**Data:** Hardcode 2-3 articles pour l'instant. Plus tard: Sanity CMS

**Articles à créer (placeholder):**
1. "10 destinations romantiques à moins de 2h de Paris"
2. "Comment organiser une surprise voyage parfaite"
3. "Voyage mystère : témoignages de 50 couples"

---

### Étape 7: Questionnaire de Personnalisation (4-5 heures)

**Fichier:** `app/reserver/questionnaire/page.tsx`

**Features:**
- 1 question par écran (mobile-friendly)
- Barre de progression
- Navigation back/forward
- Sauvegarde dans localStorage (reprendre si refresh)
- Validation par étape
- Animations de transition
- Illustrations pour chaque question

**15 questions:** Voir `docs/05-QUESTIONNAIRE-TUNNEL-RESERVATION.md`

**Questions types:**
1. Radio buttons (choix unique)
2. Checkboxes (choix multiples)
3. Slider (distance, budget)
4. Tags cliquables (régions visitées)
5. Textarea (message libre)

**State management:**
- React Context ou Zustand
- Persister dans localStorage
- Envoyer à Supabase à la fin

**Composants à créer:**
- `QuestionWrapper` - Layout question avec progression
- `RadioQuestion` - Question choix unique
- `CheckboxQuestion` - Question choix multiples
- `SliderQuestion` - Question avec slider
- `TextQuestion` - Question texte libre

---

### Étape 8: Tunnel de Réservation (8-10 heures)

**Structure:**
```
app/reserver/
├── page.tsx                    # Étape 1: Sélection thème + dates
├── questionnaire/page.tsx      # Étape 2: Questionnaire (voir Étape 7)
├── recapitulatif/page.tsx      # Étape 3: Récap + témoignage
├── informations/page.tsx       # Étape 4: Infos personnelles
├── paiement/page.tsx           # Étape 5: Paiement Stripe
├── confirmation/page.tsx       # Étape 6: Confirmation
└── layout.tsx                  # Layout avec progress bar
```

#### Étape 1: Sélection (`/reserver/page.tsx`)

**Sections:**
1. Choix thématique (3 cards radio)
2. Sélecteur de dates (calendrier)
3. Options upgrades (checkboxes)
4. Récap prix (sidebar sticky)
5. Code promo
6. CTA "Continuer"

**Composants:**
- `ThemeSelector` - 3 cards cliquables
- `DatePicker` - Calendrier avec dispo
- `OptionsSelector` - Upgrades checkboxes
- `PriceSummary` - Sidebar avec total

**State:**
```tsx
{
  theme: 'romantique' | 'nature' | 'urbain',
  startDate: Date,
  endDate: Date,
  options: {
    upgradeSuite: boolean,
    champagne: boolean,
    photoshoot: boolean,
    basket: boolean,
  },
  promoCode: string,
}
```

---

#### Étape 3: Récapitulatif (`/reserver/recapitulatif/page.tsx`)

**Sections:**
1. Résumé réservation (thème, dates, prix)
2. Vos personnalisations (résumé questionnaire)
3. Témoignage contextuel (matching theme)
4. CTA "Continuer"

**Liens:**
- Modifier dates/options
- Modifier questionnaire

---

#### Étape 4: Informations (`/reserver/informations/page.tsx`)

**Formulaire:**
- Prénom, Nom
- Email, Téléphone
- Adresse livraison boîte (5 champs)
- Checkbox: "Adresse facturation différente"
- Recap contraintes/allergies (auto du questionnaire)
- Textarea: Informations complémentaires
- Checkbox: Facture entreprise (si oui: champs SIRET, etc.)
- Checkboxes: CGV, Newsletter

**Validation:**
- React Hook Form + Zod
- Validation temps réel
- Messages d'erreur clairs

---

#### Étape 5: Paiement (`/reserver/paiement/page.tsx`)

**Layout:** 2 colonnes (desktop)

**Colonne gauche:**
- Tabs: Carte bancaire | PayPal | 3x sans frais
- Stripe Checkout Elements (iframe)
- Réassurances

**Colonne droite:**
- Récap réservation
- Trust signals (TrustPilot, logos paiement)
- Témoignage mini

**Intégration Stripe:** Voir Étape 11

---

#### Étape 6: Confirmation (`/reserver/confirmation/page.tsx`)

**Sections:**
1. Message de félicitations (animation confetti)
2. N° réservation
3. Email de confirmation envoyé
4. Prochaines étapes (timeline J-10, J-2, J-0)
5. Actions rapides (télécharger facture, calendrier, espace client)
6. Upsell optionnel (champagne, photos...)
7. Partage social
8. Code parrainage

---

### Étape 9: Espace Client (4-5 heures)

**Structure:**
```
app/espace-client/
├── connexion/page.tsx
├── inscription/page.tsx
├── tableau-de-bord/page.tsx
├── ma-reservation/page.tsx
├── mes-informations/page.tsx
└── layout.tsx
```

**Features:**
- Auth avec Supabase
- Tableau de bord:
  - Ma prochaine réservation (card)
  - Compte à rebours J-X
  - Historique voyages
- Ma réservation:
  - Détails complets
  - Télécharger carnet voyage (PDF)
  - Modifier infos (si > 30j)
  - Annuler (conditions)
- Mes informations:
  - Modifier profil
  - Changer mot de passe
  - Préférences

---

### Étape 10: Supabase Setup (3-4 heures)

**1. Créer projet Supabase**

**2. Créer tables** (SQL dans `docs/06-STACK-TECHNIQUE.md`):
- `users`
- `bookings`
- `questionnaire_responses`
- `testimonials`
- `gift_cards`

**3. Configurer Row Level Security (RLS)**

**4. Créer fichier `lib/supabase.ts`:**
```tsx
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Helpers: signUp, signIn, getUser...
```

**5. Créer API routes:**
```
app/api/
├── booking/
│   ├── create/route.ts
│   └── [id]/route.ts
└── questionnaire/
    └── save/route.ts
```

---

### Étape 11: Stripe Integration (4-5 heures)

**1. Setup Stripe**
- Créer compte Stripe
- Mode Test
- Créer produits (Romantique, Nature, Urbain)
- Créer prices

**2. Créer `lib/stripe.ts`:**
```tsx
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutSession(data) {
  // Créer session Stripe Checkout
}
```

**3. API Route create-checkout:**
```
app/api/stripe/
├── create-checkout/route.ts
└── webhook/route.ts
```

**4. Intégrer dans page paiement:**
```tsx
// /reserver/paiement/page.tsx

import { loadStripe } from '@stripe/stripe-js'

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

async function handlePayment() {
  const res = await fetch('/api/stripe/create-checkout', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  })
  const { sessionId } = await res.json()
  const { error } = await stripe.redirectToCheckout({ sessionId })
}
```

**5. Webhook pour confirmation:**
```tsx
// app/api/stripe/webhook/route.ts

export async function POST(req) {
  const event = stripe.webhooks.constructEvent(...)

  if (event.type === 'checkout.session.completed') {
    // Update booking status in Supabase
    // Send confirmation email
  }
}
```

---

### Étape 12: Emails Automatiques (3-4 heures)

**1. Setup Resend**
- Créer compte Resend
- Vérifier domaine
- API Key

**2. Créer templates React Email:**
```
emails/
├── confirmation.tsx          # J+0 après paiement
├── box-shipped.tsx           # J-10
├── reminder.tsx              # J-3
├── reveal-code.tsx           # J-2 à 18h
└── review-request.tsx        # J+3
```

**3. Créer `lib/emails.ts`:**
```tsx
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail(to, data) {
  await resend.emails.send({
    from: 'hello@voyagemystere.com',
    to,
    subject: '🎉 Votre Voyage Mystère est confirmé !',
    react: ConfirmationEmail(data),
  })
}
```

**4. Cron jobs pour emails automatiques:**
```
app/api/cron/
├── send-box-notification/route.ts    # J-10
├── send-reminder/route.ts            # J-3
└── send-reveal-code/route.ts         # J-2 à 18h
```

**5. Configurer `vercel.json`:**
```json
{
  "crons": [
    {
      "path": "/api/cron/send-box-notification",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/send-reveal-code",
      "schedule": "0 18 * * *"
    }
  ]
}
```

---

### Étape 13: Sanity CMS (4-5 heures)

**1. Setup Sanity**
```bash
npm install -g @sanity/cli
sanity init
```

**2. Créer schemas:**
```
sanity/schemas/
├── blogPost.ts
├── testimonial.ts
├── faq.ts
├── page.ts
└── settings.ts
```

**3. Intégrer dans Next.js:**
```tsx
// lib/sanity.ts
import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Fetch blog posts
export async function getBlogPosts() {
  return sanity.fetch(`*[_type == "blogPost"]`)
}
```

**4. Utiliser dans pages:**
```tsx
// app/blog/page.tsx
import { getBlogPosts } from '@/lib/sanity'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <div>{/* Render posts */}</div>
}
```

---

### Étape 14: SEO Optimization (3-4 heures)

**1. Meta tags dynamiques par page:**
```tsx
// app/destinations/romantique/page.tsx

export const metadata = {
  title: 'Voyage Mystère Romantique - Escapade en Amoureux',
  description: '...',
  openGraph: { ... },
}
```

**2. Schema markup:**
```tsx
// components/schema/organization.tsx
export function OrganizationSchema() {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        // ...
      })}
    </script>
  )
}
```

**3. Sitemap:**
```tsx
// app/sitemap.ts
export default function sitemap() {
  return [
    { url: 'https://voyagemystere.com', lastModified: new Date() },
    // ...
  ]
}
```

**4. robots.txt:**
```tsx
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://voyagemystere.com/sitemap.xml',
  }
}
```

---

### Étape 15: Analytics & Monitoring (2-3 heures)

**1. Google Analytics 4:**
```tsx
// app/layout.tsx
import Script from 'next/script'

<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
<Script id="google-analytics">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `}
</Script>
```

**2. Microsoft Clarity:**
```tsx
<Script id="clarity">
  {`
    (function(c,l,a,r,i,t,y){
      // Clarity script
    })(window,document,"clarity","script","YOUR_PROJECT_ID");
  `}
</Script>
```

**3. Track events:**
```tsx
// lib/analytics.ts
export function trackEvent(action, category, label, value) {
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Usage
trackEvent('begin_checkout', 'booking', 'romantique', 890)
```

---

### Étape 16: Testing & Deployment (3-4 heures)

**1. Tests locaux:**
- [ ] Toutes les pages s'affichent
- [ ] Navigation fonctionne
- [ ] Formulaires valident correctement
- [ ] Responsive mobile/tablet/desktop
- [ ] Cross-browser (Chrome, Safari, Firefox)

**2. Tests Stripe:**
- [ ] Paiement test mode
- [ ] Webhooks reçus
- [ ] Réservation créée en DB
- [ ] Email confirmation envoyé

**3. Lighthouse audit:**
- [ ] Performance > 90
- [ ] Accessibility 100
- [ ] Best Practices 100
- [ ] SEO 100

**4. Déploiement Vercel:**
```bash
# Push sur GitHub
git push origin main

# Vercel auto-deploy
# Ou : vercel deploy --prod
```

**5. Configuration domaine:**
- Acheter domaine (voyagemystere.com)
- Configurer DNS vers Vercel
- SSL automatique

**6. Variables d'environnement Vercel:**
- Ajouter toutes les vars de `.env.example`
- Stripe LIVE mode
- Supabase production

---

## 📅 PLANNING ESTIMÉ

### Timeline totale: 8-10 semaines (temps partiel) ou 4-5 semaines (temps plein)

**Semaine 1-2:** Composants UI + Navigation + Pages statiques
**Semaine 3:** Questionnaire + Début tunnel réservation
**Semaine 4:** Fin tunnel + Espace client
**Semaine 5:** Intégrations (Supabase, Stripe, Emails)
**Semaine 6:** Sanity CMS + Blog
**Semaine 7:** SEO + Analytics + Polish
**Semaine 8:** Tests + Déploiement

---

## 💰 BUDGET SI FREELANCE

**Estimation:** 60-80 heures de dev × 50-80€/h = **3 000 - 6 400€**

**Décomposition:**
- Composants UI: 8h × 60€ = 480€
- Pages statiques: 15h × 60€ = 900€
- Tunnel réservation: 20h × 70€ = 1 400€
- Intégrations: 15h × 70€ = 1 050€
- SEO + Tests: 10h × 60€ = 600€

**Alternative:** Agence (10 000 - 15 000€) mais plus complet (design custom, tests approfondis, support)

---

## 🎯 PRIORITÉS

### Must-Have (MVP):
1. ✅ Homepage (FAIT)
2. Pages destinations
3. Tunnel réservation complet
4. Paiement Stripe
5. Emails automatiques
6. Espace client basique

### Nice-to-Have (V2):
- Blog fonctionnel avec CMS
- Témoignages filtrables
- Carte interactive destinations
- Programme parrainage auto
- Quiz "Quelle destination pour vous ?"

---

## 📞 AIDE & RESSOURCES

**Documentation:**
- Tout est dans `/docs/` (7 documents complets)
- Copywriting: `docs/03-COPYWRITING-COMPLET.md`
- Stack technique: `docs/06-STACK-TECHNIQUE.md`

**Code actuel:**
- Voir `CODE-README.md` pour comprendre ce qui est fait

**Communauté:**
- [Next.js Discord](https://nextjs.org/discord)
- [Tailwind Discord](https://tailwindcss.com/discord)
- Stack Overflow

**Si vous bloquez:**
- Re-lisez la documentation
- Regardez les exemples Next.js
- Cherchez "Next.js + [votre problème]" sur Google

---

**Bon courage pour la suite du développement ! 🚀**

Tout est prêt pour continuer. Le plus dur (documentation + structure) est fait !
