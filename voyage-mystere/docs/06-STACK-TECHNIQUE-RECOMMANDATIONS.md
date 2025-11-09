# 🛠️ STACK TECHNIQUE & RECOMMANDATIONS

---

## 📊 COMPARATIF DES SOLUTIONS

### Option 1: NEXT.JS + TAILWIND (⭐ RECOMMANDÉ)

**Stack complète:**
- **Frontend:** Next.js 14 (App Router) + React 18
- **Styling:** Tailwind CSS + Headless UI
- **Backend:** Next.js API Routes + Server Actions
- **Base de données:** Supabase (PostgreSQL) ou Firebase
- **Paiement:** Stripe Checkout
- **Emails:** Resend ou SendGrid
- **CMS:** Sanity.io ou Contentful (headless CMS)
- **Hébergement:** Vercel (intégration parfaite avec Next.js)
- **Images:** Cloudinary ou Vercel Image Optimization

**✅ Avantages:**
- Performance exceptionnelle (SSR, ISR, optimisations auto)
- SEO optimal (pages pré-rendues, meta tags dynamiques)
- Évolutivité maximale (facile d'ajouter fonctionnalités)
- Coût réduit (hébergement Vercel gratuit jusqu'à 100GB bandwidth)
- Intégration Stripe native et simple
- Developer experience excellente (TypeScript, Hot Reload)
- Interface admin via CMS headless (facile à modifier sans dev)
- Lighthouse Score > 95/100 garanti

**❌ Inconvénients:**
- Courbe d'apprentissage si vous n'êtes pas dev (mais CMS facilite)
- Nécessite des connaissances techniques pour modifications avancées
- Temps de développement initial : 3-4 semaines

**💰 Coûts:**

| Service | Plan | Coût mensuel |
|---------|------|--------------|
| Vercel (hébergement) | Hobby (largement suffisant au début) | 0€ |
| Vercel Pro (si > 100GB bandwidth) | Pro | 20$ (si croissance forte) |
| Supabase (BDD + Auth) | Free (50K users, 500MB storage) | 0€ |
| Supabase Pro | Si croissance | 25$ |
| Sanity CMS | Free (3 users, unlimited API calls) | 0€ |
| Sanity Growth | Si plus d'utilisateurs admin | 99$ |
| Stripe | Commission | 1.4% + 0.25€ / transaction |
| Resend (emails) | Free (100 emails/day) | 0€ |
| Resend Pro | Si > 3K emails/mois | 20$ |
| Cloudinary (images) | Free (25GB storage, 25GB bandwidth) | 0€ |
| **TOTAL INITIAL** | | **~0-20€/mois** |
| **TOTAL Avec Croissance** | | **~150-200€/mois** |

**Coût de développement initial:** 1500-2000€ (freelance) ou DIY gratuit

**⭐ Recommandation:** C'EST LA MEILLEURE OPTION pour votre projet.
- Budget initial ultra-faible
- Performance au top
- SEO parfait
- Vous gardez le contrôle (pas enfermé dans un outil propriétaire)
- Interface CMS pour modifications sans dev

---

### Option 2: WEBFLOW

**Stack:**
- Webflow (design + hébergement + CMS tout-en-un)
- Intégrations via Zapier pour paiement/emails

**✅ Avantages:**
- No-code total (design visuel, glisser-déposer)
- Lancement rapide (1-2 semaines)
- Interface CMS intégrée (facile à modifier)
- Design responsive automatique
- Hébergement inclus

**❌ Inconvénients:**
- Coût élevé à long terme
- Moins flexible pour fonctionnalités complexes (questionnaire, tunnel)
- Performance moins bonne que Next.js
- SEO correct mais pas optimal
- Intégration Stripe via tiers (Memberstack, Foxy.io = complexe + coûts)
- Vendor lock-in (difficile de migrer ailleurs)

**💰 Coûts:**

| Service | Coût |
|---------|------|
| Webflow Site Plan | 14$/mois (CMS basique) |
| Webflow Business Plan (requis pour e-commerce) | 39$/mois |
| Memberstack (pour paiements) | 25-99$/mois |
| Zapier (automations) | 20-50$/mois |
| **TOTAL** | **~80-190$/mois (75-180€)** |

**Coût de développement initial:** 1000-1500€ (designer Webflow) ou DIY

**❌ Non recommandé pour ce projet** car :
- Trop cher à long terme pour les features nécessaires
- Complexité du tunnel de réservation + questionnaire (pas natif)
- Vous serez bloqué si vous voulez évoluer

---

### Option 3: WORDPRESS + WOOCOMMERCE

**Stack:**
- WordPress 6.x
- WooCommerce (e-commerce)
- Plugins: Stripe, Bookly (réservations), Typeform (questionnaire)

**✅ Avantages:**
- Écosystème énorme (plugins pour tout)
- Interface admin familière
- Coût initial faible
- Facile à modifier (éditeur Gutenberg)

**❌ Inconvénients:**
- Performance médiocre (surtout avec beaucoup de plugins)
- SEO correct mais pas optimal (sites lourds)
- Sécurité à surveiller (WordPress = cible de hacks)
- Maintenance lourde (mises à jour WordPress + plugins régulières)
- Design moins moderne par défaut

**💰 Coûts:**

| Service | Coût |
|---------|------|
| Hébergement (WP Engine, Kinsta) | 25-35€/mois |
| Thème premium (Divi, Astra Pro) | 60-90€/an |
| Plugins premium (Bookly, Stripe, etc.) | ~150€/an |
| **TOTAL** | **~40-50€/mois** |

**Coût de développement initial:** 800-1200€ (dev WP) ou DIY

**❌ Non recommandé** car :
- Performance insuffisante pour un site moderne
- Trop de plugins = complexité + failles sécurité
- Maintenance chronophage

---

### Option 4: SHOPIFY

**Stack:**
- Shopify (e-commerce tout-en-un)
- Apps Shopify pour fonctionnalités

**✅ Avantages:**
- E-commerce clé-en-main
- Paiement intégré (Shopify Payments)
- Interface admin simple
- Apps pour étendre

**❌ Inconvénients:**
- Conçu pour vendre des PRODUITS, pas des expériences/réservations
- Rigide (difficile de customiser le tunnel)
- Commission sur transactions (2% si pas Shopify Payments)
- Blog basique (SEO limité)

**💰 Coûts:**

| Service | Coût |
|---------|------|
| Shopify Basic | 29$/mois |
| Apps (réservation, questionnaire...) | ~50$/mois |
| Commission transactions (si pas Shopify Payments) | 2% |
| **TOTAL** | **~80$/mois + 2% commission** |

**❌ Non recommandé** car pas adapté à des voyages/services complexes.

---

## ⭐ RECOMMANDATION FINALE

### 👑 OPTION GAGNANTE: NEXT.JS 14 + TAILWIND + SUPABASE + SANITY

**Pourquoi ?**

✅ **Budget initial minimal:** 0-20€/mois au début
✅ **Performance maximale:** Lighthouse 95+/100, SEO optimal
✅ **Flexibilité totale:** Vous pouvez tout customiser
✅ **Scalabilité:** De 0 à 10 000 clients sans refonte
✅ **Interface admin:** Sanity CMS = facile à modifier sans dev
✅ **Pas de vendor lock-in:** Votre code vous appartient
✅ **Moderne:** React, TypeScript, best practices 2024

**Pour qui ?**
- Vous (ou votre dev) avez des bases en code OU
- Vous engagez un freelance Next.js (1500-2000€ one-time) OU
- Vous utilisez des templates Next.js + Tailwind (nombreux sur le marché)

---

## 🔧 STACK TECHNIQUE DÉTAILLÉE (Next.js)

### Architecture

```
voyage-mystere/
├── app/                          # Next.js 14 App Router
│   ├── (marketing)/              # Routes marketing (public)
│   │   ├── page.tsx              # Homepage
│   │   ├── comment-ca-marche/
│   │   ├── destinations/
│   │   ├── temoignages/
│   │   ├── faq/
│   │   ├── offrir/
│   │   ├── blog/
│   │   └── contact/
│   ├── reserver/                 # Tunnel de réservation
│   │   ├── page.tsx              # Étape 1: Sélection
│   │   ├── questionnaire/
│   │   ├── recapitulatif/
│   │   ├── informations/
│   │   ├── paiement/
│   │   └── confirmation/
│   ├── espace-client/            # Dashboard client (authentifié)
│   │   ├── tableau-de-bord/
│   │   ├── ma-reservation/
│   │   └── mes-informations/
│   ├── api/                      # API Routes
│   │   ├── stripe/               # Webhooks Stripe
│   │   ├── reservation/          # Créer/modifier réservations
│   │   ├── questionnaire/        # Sauvegarder réponses
│   │   └── emails/               # Envoyer emails
│   └── layout.tsx                # Layout global
├── components/                   # Composants React réutilisables
│   ├── ui/                       # Composants UI (buttons, cards, inputs)
│   ├── marketing/                # Composants pages marketing
│   ├── booking/                  # Composants tunnel réservation
│   └── dashboard/                # Composants espace client
├── lib/                          # Utilitaires, helpers
│   ├── supabase.ts               # Client Supabase
│   ├── stripe.ts                 # Client Stripe
│   ├── emails.ts                 # Templates emails
│   └── utils.ts                  # Helpers généraux
├── public/                       # Assets statiques
│   ├── images/
│   ├── videos/
│   └── fonts/
├── styles/                       # Styles globaux
│   └── globals.css               # Tailwind + styles custom
├── sanity/                       # Sanity CMS config
│   ├── schemas/                  # Schémas de contenu
│   └── sanity.config.ts
├── package.json
├── tailwind.config.ts            # Config Tailwind
├── next.config.js                # Config Next.js
└── tsconfig.json                 # Config TypeScript
```

---

### Technologies Précises

**Frontend:**
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss": "^3.4.0",
  "@headlessui/react": "^1.7.0",  // Composants accessibles
  "framer-motion": "^10.16.0",    // Animations fluides
  "lucide-react": "^0.294.0",     // Icônes
  "react-hook-form": "^7.48.0",   // Formulaires performants
  "zod": "^3.22.0"                // Validation schemas
}
```

**Backend & Services:**
```json
{
  "@supabase/supabase-js": "^2.38.0",  // Database + Auth
  "@stripe/stripe-js": "^2.2.0",        // Stripe client
  "stripe": "^14.5.0",                  // Stripe server
  "resend": "^2.0.0",                   // Emails transactionnels
  "react-email": "^1.10.0"              // Templates emails React
}
```

**CMS:**
```json
{
  "@sanity/client": "^6.8.0",
  "@sanity/image-url": "^1.0.2",
  "next-sanity": "^6.0.0"
}
```

**Développement:**
```json
{
  "typescript": "^5.3.0",
  "eslint": "^8.54.0",
  "prettier": "^3.1.0",
  "@types/react": "^18.2.0",
  "@types/node": "^20.0.0"
}
```

---

## 🗄️ BASE DE DONNÉES (Supabase)

### Schéma des Tables

**Table: `users`**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Table: `bookings`**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(50) UNIQUE NOT NULL, -- Ex: VM-2024-06-1842
  user_id UUID REFERENCES users(id),
  theme VARCHAR(20) NOT NULL, -- 'romantique', 'nature', 'urbain'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INT DEFAULT 2,
  status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled, completed
  total_price DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'paid',
  stripe_payment_id VARCHAR(255),

  -- Options
  upgrade_suite BOOLEAN DEFAULT FALSE,
  option_champagne BOOLEAN DEFAULT FALSE,
  option_photoshoot BOOLEAN DEFAULT FALSE,
  option_basket BOOLEAN DEFAULT FALSE,

  -- Shipping info (boîte mystère)
  shipping_address_line1 VARCHAR(255),
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100) DEFAULT 'France',
  box_shipped_at TIMESTAMP,
  box_tracking_number VARCHAR(100),

  -- Destination (révélée J-2)
  destination_revealed BOOLEAN DEFAULT FALSE,
  destination_city VARCHAR(100),
  destination_region VARCHAR(100),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Table: `questionnaire_responses`**
```sql
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,

  -- Réponses (JSON pour flexibilité)
  occasion VARCHAR(100),
  traveler_styles VARCHAR(255)[], -- Array: ['gourmands', 'sportifs']
  rhythm VARCHAR(50),
  extra_budget VARCHAR(50),
  dietary_restrictions VARCHAR(255)[],
  mobility_constraints VARCHAR(100),
  phobias VARCHAR(255)[],
  visited_regions VARCHAR(255)[],
  max_distance INT,
  transport_preference VARCHAR(50),
  accommodation_preference VARCHAR(100),
  favorite_time_of_day VARCHAR(50),
  unique_experience VARCHAR(100),
  music_vibe VARCHAR(50),
  couple_in_3_words VARCHAR(255),
  special_request TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);
```

**Table: `testimonials`**
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  couple_names VARCHAR(200), -- "Julie & Marc"
  couple_age VARCHAR(50), -- "29 et 32 ans"
  couple_city VARCHAR(100),
  theme VARCHAR(20),
  destination_revealed VARCHAR(100),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  testimonial_text TEXT,
  has_video BOOLEAN DEFAULT FALSE,
  video_url VARCHAR(500),
  photos_urls VARCHAR(500)[],
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE, -- Mis en avant sur homepage
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Table: `blog_posts`** (si pas Sanity)
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url VARCHAR(500),
  author VARCHAR(100),
  category VARCHAR(100),
  tags VARCHAR(100)[],
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  seo_title VARCHAR(60),
  seo_description VARCHAR(155),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Table: `gift_cards`**
```sql
CREATE TABLE gift_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL, -- Ex: CLARA50, GIFT-ABC123
  amount DECIMAL(10,2) NOT NULL,
  balance DECIMAL(10,2) NOT NULL, -- Diminue quand utilisé
  purchaser_email VARCHAR(255),
  purchaser_name VARCHAR(200),
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(200),
  recipient_address TEXT, -- Si format physique
  personalized_message TEXT,
  format VARCHAR(20), -- 'digital' ou 'physical'
  sent_at TIMESTAMP,
  used_at TIMESTAMP,
  expires_at TIMESTAMP, -- 12 mois après achat
  status VARCHAR(20) DEFAULT 'active', -- active, used, expired
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 💳 INTÉGRATION STRIPE

### Flow de Paiement

**Étape 1: Création Checkout Session (API Route)**

```typescript
// app/api/stripe/create-checkout/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { bookingData, amount } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Voyage Mystère ${bookingData.theme}`,
            description: `${bookingData.startDate} - ${bookingData.endDate}`,
            images: ['https://...'], // Image du thème
          },
          unit_amount: amount * 100, // En centimes
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/reserver/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/reserver/paiement`,
    metadata: {
      bookingId: bookingData.id,
      userEmail: bookingData.email,
    },
  });

  return Response.json({ sessionId: session.id });
}
```

**Étape 2: Webhook Stripe (confirmation paiement)**

```typescript
// app/api/stripe/webhook/route.ts
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { sendConfirmationEmail } from '@/lib/emails';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Mettre à jour la réservation
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        stripe_payment_id: session.payment_intent as string,
        status: 'confirmed',
      })
      .eq('id', session.metadata?.bookingId);

    // Envoyer email de confirmation
    await sendConfirmationEmail(session.metadata?.userEmail);
  }

  return Response.json({ received: true });
}
```

---

## 📧 SYSTÈME D'EMAILS AUTOMATIQUES

### Service: Resend + React Email

**Templates d'emails:**

1. **Email de confirmation (immédiat après paiement)**
2. **Email J-10 (envoi boîte mystère + tracking)**
3. **Email J-3 (rappel, conseils valise)**
4. **Email J-2 à 18h (CODE de révélation)**
5. **Email J+3 (demande avis + code parrainage)**

**Exemple de template (React Email):**

```tsx
// emails/confirmation.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
} from '@react-email/components';

interface ConfirmationEmailProps {
  firstName: string;
  bookingNumber: string;
  theme: string;
  startDate: string;
  endDate: string;
}

export default function ConfirmationEmail({
  firstName,
  bookingNumber,
  theme,
  startDate,
  endDate,
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Heading>🎉 {firstName}, votre aventure commence !</Heading>

          <Section>
            <Text>Votre réservation est confirmée ! Voici votre récapitulatif :</Text>

            <Text><strong>N° de réservation :</strong> {bookingNumber}</Text>
            <Text><strong>Thématique :</strong> {theme}</Text>
            <Text><strong>Dates :</strong> {startDate} - {endDate}</Text>
          </Section>

          <Section>
            <Heading as="h2">Prochaines étapes</Heading>
            <Text>📦 <strong>10 jours avant :</strong> Vous recevrez la boîte mystère</Text>
            <Text>🔑 <strong>48h avant :</strong> Vous recevrez le code pour découvrir votre destination</Text>
          </Section>

          <Button href="https://voyagemystere.com/espace-client" style={{ backgroundColor: '#3B82F6', color: '#fff' }}>
            Accéder à mon espace client
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

**Automatisation avec Cron Jobs (Vercel Cron):**

```typescript
// app/api/cron/send-box-notification/route.ts
export async function GET() {
  // Récupérer les réservations J-10
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('start_date', addDays(new Date(), 10))
    .eq('box_shipped_at', null);

  for (const booking of bookings) {
    // Envoyer email J-10
    await sendBoxShippedEmail(booking.user_id);

    // Mettre à jour
    await supabase
      .from('bookings')
      .update({ box_shipped_at: new Date() })
      .eq('id', booking.id);
  }

  return Response.json({ sent: bookings.length });
}
```

**Configurer dans `vercel.json`:**

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

## 🖼️ GESTION DES IMAGES (Cloudinary)

**Pourquoi Cloudinary ?**
- Optimisation automatique (WebP, AVIF, tailles responsive)
- CDN mondial ultra-rapide
- Transformations à la volée (crop, resize, filters)
- Plan gratuit généreux (25GB storage, 25GB bandwidth)

**Intégration:**

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function getOptimizedImageUrl(publicId: string, width: number) {
  return cloudinary.url(publicId, {
    transformation: [
      { width, crop: 'scale' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  });
}
```

**Usage dans composants:**

```tsx
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export function HeroImage() {
  return (
    <Image
      src={getOptimizedImageUrl('voyage-mystere/hero', 1200)}
      alt="Couple ouvrant boîte mystère"
      width={1200}
      height={600}
      priority
    />
  );
}
```

---

## 📊 ANALYTICS & TRACKING

**Google Analytics 4:**

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Tracking événements personnalisés:**

```typescript
// lib/analytics.ts
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Usage
trackEvent('begin_checkout', 'booking', 'romantique', 890);
```

**Autres outils recommandés:**
- **Microsoft Clarity** (gratuit) : Heatmaps + session recordings
- **Meta Pixel** : Retargeting Facebook/Instagram
- **TikTok Pixel** : Retargeting TikTok

---

## 🔐 AUTHENTIFICATION (Supabase Auth)

**Configuration simple:**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Sign up
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

// Sign in
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// Get user
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
```

---

## 🚀 HÉBERGEMENT & DÉPLOIEMENT (Vercel)

**Pourquoi Vercel ?**
- Intégration parfaite avec Next.js (même équipe)
- Déploiement automatique depuis GitHub
- Preview deployments (branche = URL preview)
- Edge Functions ultra-rapides
- CDN mondial
- Certificat SSL auto
- Plan gratuit généreux

**Déploiement:**

1. Push code sur GitHub
2. Connecter repo à Vercel (1 clic)
3. Vercel détecte Next.js automatiquement
4. Build + Deploy en 2 minutes
5. URL: `voyage-mystere.vercel.app` (ou custom domain)

**Variables d'environnement:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend
RESEND_API_KEY=re_xxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 📈 SEO OPTIMIZATION

### Next.js Metadata API

```typescript
// app/page.tsx (Homepage)
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voyage Mystère Premium - Week-end Surprise Haut de Gamme',
  description: 'Vivez l\'émotion d\'un voyage surprise ! Destination révélée 48h avant. 2 nuits tout compris dès 700€. Réservez votre aventure.',
  keywords: ['voyage mystère', 'week-end surprise', 'voyage surprise', 'cadeau original'],
  openGraph: {
    title: 'Voyage Mystère Premium',
    description: 'Destination révélée 48h avant. L\'aventure commence maintenant.',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voyage Mystère Premium',
    description: 'Destination révélée 48h avant.',
    images: ['/og-image.jpg'],
  },
};
```

### Schema Markup (JSON-LD)

```typescript
// components/schema/organization.tsx
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Voyage Mystère Premium',
    url: 'https://voyagemystere.com',
    logo: 'https://voyagemystere.com/logo.png',
    description: 'Agence de voyages surprise haut de gamme',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    sameAs: [
      'https://www.instagram.com/voyagemystere',
      'https://www.facebook.com/voyagemystere',
      'https://www.tiktok.com/@voyagemystere',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '380',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Sitemap Automatique

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://voyagemystere.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://voyagemystere.com/comment-ca-marche',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://voyagemystere.com/destinations',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // ... autres pages
  ];
}
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### Checklist Performance

**Images:**
- ✅ Next.js Image component (lazy loading auto)
- ✅ WebP / AVIF via Cloudinary
- ✅ Tailles responsive (srcset auto)
- ✅ Priority sur hero image

**Fonts:**
- ✅ Google Fonts optimisées via next/font
- ✅ Font-display: swap
- ✅ Préchargement fonts critiques

**Code:**
- ✅ Code splitting automatique (Next.js)
- ✅ Tree shaking (Tailwind PurgeCSS)
- ✅ Dynamic imports pour composants lourds
- ✅ Minimize JS bundle

**Caching:**
- ✅ ISR (Incremental Static Regeneration) pour pages semi-statiques
- ✅ CDN caching (Vercel Edge Network)
- ✅ Browser caching optimal

**Objectif Lighthouse:**
- Performance: > 95
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## 🛡️ SÉCURITÉ

**Checklist Sécurité:**

✅ HTTPS forcé (Vercel automatique)
✅ CORS configuré correctement
✅ Variables d'environnement sécurisées (jamais exposées côté client)
✅ Validation inputs (Zod)
✅ Protection CSRF (Next.js intégré)
✅ Rate limiting API (Upstash Redis)
✅ Stripe en mode checkout (pas de carte côté serveur)
✅ Supabase Row Level Security (RLS)
✅ Sanitization des données utilisateurs
✅ Headers sécurité (next.config.js)

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## 📱 RESPONSIVE & MOBILE-FIRST

**Breakpoints Tailwind:**

```javascript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
};
```

**Approche:**
- Design mobile FIRST (90% du trafic sera mobile)
- Touch-friendly (boutons min 44px)
- Formulaires optimisés mobile (bon clavier, auto-zoom désactivé)
- Navigation hamburger sur mobile
- Images optimisées par device

---

## 🎯 CHECKLIST LANCEMENT

**Pré-lancement:**
- [ ] Tests cross-browser (Chrome, Safari, Firefox, Edge)
- [ ] Tests mobile (iOS Safari, Chrome Android)
- [ ] Tests tunnel complet (de la homepage au paiement)
- [ ] Stripe en mode TEST validé
- [ ] Tous les emails envoyés et testés
- [ ] Google Analytics configuré et testé
- [ ] Sitemap soumis à Google Search Console
- [ ] robots.txt configuré
- [ ] Certificat SSL actif
- [ ] Domaine custom configuré
- [ ] Mentions légales, CGV, Politique de confidentialité
- [ ] RGPD: Cookie banner + consentement

**Lancement:**
- [ ] Passer Stripe en mode LIVE
- [ ] Vérifier webhooks Stripe en production
- [ ] Monitoring erreurs (Sentry)
- [ ] Backup database configuré
- [ ] Support client prêt (email + chat)

---

*Document créé le 09/11/2024 • Version 1.0*
