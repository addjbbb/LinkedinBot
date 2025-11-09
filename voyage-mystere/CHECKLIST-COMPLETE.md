# ✅ CHECKLIST COMPLÈTE - Pour un site 100% fonctionnel

> **Dernière mise à jour :** 9 novembre 2024
> **Objectif :** Site prêt pour production avec paiements réels

---

## 📊 VUE D'ENSEMBLE

**État actuel :** 60% complet
- ✅ Code frontend : 100%
- ✅ Design : 100%
- ✅ Pages : 100%
- ⚠️ Backend : 0% (code prêt, config à faire)
- ⚠️ Contenu : 30% (placeholders)
- ⚠️ Tests : 0%

---

## 🔴 CRITIQUE (Bloquant pour production)

### 1. Base de données Supabase ⚠️ OBLIGATOIRE

**Pourquoi :** Sans BDD, impossible de stocker les réservations

**Actions :**
- [ ] Créer compte sur https://supabase.com (GRATUIT)
- [ ] Créer nouveau projet Supabase
- [ ] Copier URL + ANON_KEY dans `.env.local`
- [ ] Exécuter le SQL ci-dessous dans SQL Editor

**SQL à exécuter :**
```sql
-- 1. Table users (clients)
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  referral_code VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Table bookings (réservations)
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  theme VARCHAR(50) NOT NULL, -- 'romantique', 'nature', 'urbain'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INTEGER DEFAULT 2,
  price DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  stripe_payment_intent_id VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  postal_code VARCHAR(20),
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'France',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Table questionnaire_responses
CREATE TABLE questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  occasion VARCHAR(100),
  traveler_style TEXT[], -- array de string
  rhythm VARCHAR(50),
  budget VARCHAR(50),
  dietary_restrictions TEXT[],
  mobility VARCHAR(50),
  phobias TEXT[],
  visited_regions TEXT[],
  max_distance INTEGER,
  transport_preference VARCHAR(50),
  accommodation_type VARCHAR(50),
  preferred_time VARCHAR(50),
  desired_experience TEXT,
  music_preference VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Table referrals (parrainage)
CREATE TABLE referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES users(id),
  referrer_code VARCHAR(50) NOT NULL,
  referee_email VARCHAR(255) NOT NULL,
  referee_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'credited'
  credit_amount DECIMAL(10,2) DEFAULT 50.00,
  booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- 5. Table gift_cards (cartes cadeaux)
CREATE TABLE gift_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  buyer_name VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(100),
  message TEXT,
  format VARCHAR(50) DEFAULT 'digital', -- 'digital', 'physical'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'used', 'expired'
  used_by_booking_id UUID REFERENCES bookings(id),
  valid_until DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

-- Index pour performance
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_questionnaire_booking ON questionnaire_responses(booking_id);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referee_email ON referrals(referee_email);
CREATE INDEX idx_gift_cards_code ON gift_cards(code);

-- RLS (Row Level Security) - À activer
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

-- Policies basiques (à adapter selon vos besoins)
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (true);
```

**Temps estimé :** 30 minutes

---

### 2. Paiements Stripe ⚠️ OBLIGATOIRE

**Pourquoi :** Impossible d'accepter des paiements sans Stripe configuré

**Actions :**
- [ ] Créer compte sur https://stripe.com (GRATUIT en test mode)
- [ ] Activer mode TEST
- [ ] Copier clés API (Publishable + Secret) dans `.env.local`
- [ ] Créer 3 produits dans Stripe Dashboard :

**Produits à créer :**

1. **Voyage Romantique**
   - Prix : 890€
   - Description : "Week-end surprise romantique 2 nuits"
   - Copier Price ID → `NEXT_PUBLIC_STRIPE_PRICE_ROMANTIQUE`

2. **Voyage Nature**
   - Prix : 750€
   - Description : "Week-end surprise nature 2 nuits"
   - Copier Price ID → `NEXT_PUBLIC_STRIPE_PRICE_NATURE`

3. **Voyage Urbain**
   - Prix : 820€
   - Description : "Week-end surprise urbain 2 nuits"
   - Copier Price ID → `NEXT_PUBLIC_STRIPE_PRICE_URBAIN`

**Options additionnelles (optionnel) :**
- Upgrade Suite Prestige : +150€
- Champagne & Pétales : +50€
- Shooting Photo : +120€
- Panier gourmand : +45€

**Webhook Stripe :**
- [ ] Installer Stripe CLI : `brew install stripe/stripe-cli/stripe`
- [ ] Lancer webhook local : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Copier le webhook secret → `STRIPE_WEBHOOK_SECRET`

**Test de paiement :**
```
Carte test : 4242 4242 4242 4242
Date : n'importe quelle date future
CVC : n'importe quel 3 chiffres
```

**Temps estimé :** 1 heure

---

### 3. Variables d'environnement ⚠️ OBLIGATOIRE

**Créer fichier `.env.local` à la racine avec :**

```bash
# Next.js
NEXT_PUBLIC_URL=http://localhost:3000

# Supabase (OBLIGATOIRE)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (OBLIGATOIRE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx

# Stripe Price IDs (OBLIGATOIRE)
NEXT_PUBLIC_STRIPE_PRICE_ROMANTIQUE=price_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_NATURE=price_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_URBAIN=price_xxxxxxxxxx

# Optionnel pour options
NEXT_PUBLIC_STRIPE_PRICE_ROMANTIQUE_PRESTIGE=price_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_CHAMPAGNE=price_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_PHOTOSHOOT=price_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_BASKET=price_xxxxxxxxxx

# Resend (Emails) - Optionnel au début
RESEND_API_KEY=re_xxxxxxxxxx
RESEND_FROM_EMAIL=hello@voyagemystere.com

# Google Analytics - Optionnel
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry - Optionnel
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxx@xxxxxxxxxx.ingest.sentry.io/xxxxxxxxxx
```

**Temps estimé :** 15 minutes (après avoir Supabase + Stripe)

---

## 🟡 IMPORTANT (Fortement recommandé)

### 4. Emails automatiques 📧

**Service : Resend** (100 emails/jour GRATUIT)

**Actions :**
- [ ] Créer compte sur https://resend.com
- [ ] Vérifier votre domaine (ou utiliser resend.dev pour tests)
- [ ] Copier API Key → `RESEND_API_KEY`
- [ ] Tester l'envoi d'email de confirmation

**Emails à configurer :**
1. ✅ Confirmation réservation (déjà codé dans `lib/email-templates.ts`)
2. ✅ Boîte mystère expédiée J-10 (déjà codé)
3. ✅ Rappel J-3 (déjà codé)
4. ✅ Code révélation J-2 à 18h (déjà codé)
5. ✅ Demande d'avis J+3 (déjà codé)

**Test :**
```bash
# Dans votre terminal
curl -X POST http://localhost:3000/api/test-email
```

**Temps estimé :** 30 minutes

---

### 5. Authentification Supabase 🔐

**Pourquoi :** Protéger espace client et admin

**Actions :**
- [ ] Activer Email Auth dans Supabase Dashboard
- [ ] Configurer Email Templates (optionnel)
- [ ] Tester inscription : `/inscription`
- [ ] Tester connexion : `/login`
- [ ] Vérifier que `/espace-client` est protégé

**Middleware à créer :**

```tsx
// middleware.ts (à la racine du projet)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protéger /espace-client
  if (req.nextUrl.pathname.startsWith('/espace-client')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Protéger /admin (vérifier rôle admin)
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // TODO: Vérifier que user.role === 'admin'
  }

  return res
}

export const config = {
  matcher: ['/espace-client/:path*', '/admin/:path*'],
}
```

**Temps estimé :** 1 heure

---

### 6. Google Analytics (tracking) 📊

**Actions :**
- [ ] Créer compte Google Analytics 4
- [ ] Créer propriété GA4
- [ ] Copier Measurement ID (G-XXXXXXXXXX) → `NEXT_PUBLIC_GA_ID`
- [ ] Vérifier que le tracking fonctionne dans GA4 Realtime

**Le code est déjà prêt dans :**
- `lib/analytics.ts` - 15+ événements trackés
- `app/layout.tsx` - Script GA4 déjà intégré

**Temps estimé :** 20 minutes

---

## 🟢 OPTIONNEL (Améliore l'expérience)

### 7. Images réelles 📸

**Remplacer les placeholders Unsplash :**

**Images à créer/acheter :**
- [ ] Logo Voyage Mystère (format PNG transparent)
- [ ] 3 photos thèmes (Romantique, Nature, Urbain) - haute qualité
- [ ] 6-10 photos destinations françaises
- [ ] 3 photos témoignages clients
- [ ] Images blog (6 articles)
- [ ] Favicon (32x32, 180x180, 192x192, 512x512)

**Services recommandés :**
- Unsplash Pro (payant, haute qualité)
- Adobe Stock (payant)
- Photographe pro (300-500€ pour shooting)

**Optimisation :**
- [ ] Installer Cloudinary (ou utiliser Next.js Image)
- [ ] Compresser toutes les images (TinyPNG)
- [ ] Format WebP pour performance

**Temps estimé :** 4-6 heures

---

### 8. Contenu légal personnalisé ⚖️

**Pages à compléter :**

**`/cgv` - Conditions Générales de Vente**
- [ ] Remplacer `[À COMPLÉTER]` par :
  - Raison sociale
  - Adresse siège social
  - SIRET / RCS
  - Capital social
  - Numéro TVA

**`/mentions-legales` - Mentions Légales**
- [ ] Remplacer `[À COMPLÉTER]` par :
  - Directeur de publication (nom + prénom)
  - Coordonnées exactes

**`/confidentialite` - Politique de confidentialité**
- [ ] Remplacer `[À COMPLÉTER]` par :
  - Nom du DPO (Data Protection Officer)
  - Email contact RGPD

**Temps estimé :** 1 heure

---

### 9. Cookie Banner (RGPD) 🍪

**Pourquoi :** Obligatoire si vous utilisez Google Analytics

**Solutions :**

**Option 1 : Tarteaucitron.js** (GRATUIT, français)
```bash
npm install tarteaucitron.js
```

**Option 2 : Axeptio** (Payant, très pro)
- https://www.axept.io/
- 29€/mois

**Option 3 : CookieYes** (Freemium)
- https://www.cookieyes.com/

**Temps estimé :** 30 minutes

---

### 10. Monitoring d'erreurs (Sentry) 🐛

**Pourquoi :** Être alerté des bugs en production

**Actions :**
- [ ] Créer compte sur https://sentry.io (GRATUIT 5K events/mois)
- [ ] Installer : `npx @sentry/wizard@latest -i nextjs`
- [ ] Copier DSN → `NEXT_PUBLIC_SENTRY_DSN`
- [ ] Tester en créant une erreur volontaire

**Le code est déjà prêt dans :**
- `lib/sentry.ts` - Toutes les fonctions

**Temps estimé :** 20 minutes

---

## 🧪 TESTS AVANT LANCEMENT

### 11. Tests fonctionnels ✅

**Tunnel de réservation complet :**
- [ ] Accéder à `/reserver`
- [ ] Sélectionner thème Romantique
- [ ] Choisir dates (dans 30+ jours)
- [ ] Remplir questionnaire (15 questions)
- [ ] Vérifier récapitulatif
- [ ] Remplir informations personnelles
- [ ] Aller jusqu'au paiement Stripe
- [ ] Payer avec carte test `4242 4242 4242 4242`
- [ ] Vérifier page confirmation
- [ ] Vérifier email de confirmation reçu
- [ ] Vérifier réservation dans Supabase
- [ ] Vérifier webhook Stripe reçu

**Espace client :**
- [ ] S'inscrire via `/inscription`
- [ ] Recevoir email de vérification
- [ ] Se connecter via `/login`
- [ ] Accéder `/espace-client`
- [ ] Voir sa réservation
- [ ] Modifier profil
- [ ] Se déconnecter

**Admin :**
- [ ] Accéder `/admin`
- [ ] Voir les stats (réservations, CA)
- [ ] Voir le tableau des réservations
- [ ] Rechercher une réservation
- [ ] Filtrer par statut

**Temps estimé :** 2 heures

---

### 12. Tests multi-navigateurs 🌐

**À tester sur :**
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Safari iOS (mobile)
- [ ] Chrome Android (mobile)

**Points à vérifier :**
- [ ] Navigation fluide
- [ ] Formulaires fonctionnels
- [ ] Paiement Stripe
- [ ] Responsive design
- [ ] Pas d'erreurs console

**Temps estimé :** 1 heure

---

### 13. Performance Lighthouse 🚀

**Objectifs :**
- Performance : > 90/100
- Accessibility : 100/100
- Best Practices : 100/100
- SEO : 100/100

**Actions :**
- [ ] Ouvrir DevTools > Lighthouse
- [ ] Lancer audit (Mode Incognito)
- [ ] Corriger les warnings
- [ ] Optimiser les images si score < 90
- [ ] Vérifier Core Web Vitals

**Temps estimé :** 1 heure

---

## 🚀 DÉPLOIEMENT PRODUCTION

### 14. Déploiement Vercel 🌍

**Actions :**
- [ ] Créer compte Vercel (GRATUIT)
- [ ] Connecter votre repo GitHub
- [ ] Configurer variables d'environnement (même que `.env.local`)
- [ ] Déployer
- [ ] Vérifier que le site fonctionne sur URL Vercel

**Commandes :**
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Déployer en production
vercel --prod
```

**Temps estimé :** 30 minutes

---

### 15. Domaine personnalisé 🌐

**Actions :**
- [ ] Acheter domaine (ex: voyage-mystere.fr sur Gandi, OVH, etc.)
- [ ] Configurer DNS vers Vercel
- [ ] Attendre propagation DNS (24-48h max)
- [ ] Vérifier SSL automatique activé

**Coût :** 12-15€/an

**Temps estimé :** 15 min (+ attente DNS)

---

### 16. Stripe LIVE mode 💳

**⚠️ TRÈS IMPORTANT :**

**Actions :**
- [ ] Activer mode LIVE dans Stripe Dashboard
- [ ] Compléter informations entreprise
- [ ] Vérifier identité (KYC)
- [ ] Créer produits en LIVE (mêmes prix qu'en test)
- [ ] Remplacer clés TEST par clés LIVE dans Vercel env vars
- [ ] Configurer webhook LIVE : `https://votre-domaine.com/api/webhooks/stripe`
- [ ] Tester un vrai paiement (puis le rembourser)

**Temps estimé :** 1 heure

---

## 📊 RÉCAPITULATIF PAR PRIORITÉ

### 🔴 À FAIRE ABSOLUMENT (Bloquant)
1. ✅ Supabase + Base de données (30 min)
2. ✅ Stripe mode Test (1h)
3. ✅ Variables d'environnement (15 min)
4. ✅ Test tunnel réservation complet (2h)

**Total : ~4 heures**

---

### 🟡 Fortement recommandé
5. ✅ Emails Resend (30 min)
6. ✅ Authentification (1h)
7. ✅ Google Analytics (20 min)
8. ✅ Tests multi-navigateurs (1h)

**Total : ~3 heures**

---

### 🟢 Améliore l'expérience
9. ✅ Images réelles (4-6h)
10. ✅ Contenu légal (1h)
11. ✅ Cookie Banner (30 min)
12. ✅ Sentry (20 min)
13. ✅ Lighthouse optimization (1h)

**Total : ~7 heures**

---

### 🚀 Déploiement
14. ✅ Vercel deployment (30 min)
15. ✅ Domaine personnalisé (15 min)
16. ✅ Stripe LIVE mode (1h)

**Total : ~2 heures**

---

## ⏱️ TEMPS TOTAL ESTIMÉ

**Minimum viable (juste fonctionnel) :** 4 heures
**Recommandé (bonne expérience) :** 7 heures
**Complet (prêt pro) :** 14 heures
**Avec contenu (images, textes) :** 20 heures

---

## 🎯 ORDRE D'EXÉCUTION RECOMMANDÉ

### Jour 1 (4h) - Base fonctionnelle
1. Créer Supabase + tables (30 min)
2. Créer Stripe + produits (1h)
3. Configurer `.env.local` (15 min)
4. Tester tunnel complet (2h)
5. ✅ **Milestone : Premier paiement test réussi !**

### Jour 2 (3h) - Finitions essentielles
6. Resend emails (30 min)
7. Authentification (1h)
8. Google Analytics (20 min)
9. Tests navigateurs (1h)
10. ✅ **Milestone : Site utilisable par de vrais clients**

### Jour 3 (7h) - Polish professionnel
11. Images réelles (4-6h)
12. Contenu légal (1h)
13. Cookie banner (30 min)
14. Sentry (20 min)
15. Lighthouse (1h)
16. ✅ **Milestone : Site professionnel**

### Jour 4 (2h) - Mise en production
17. Deploy Vercel (30 min)
18. Domaine (15 min)
19. Stripe LIVE (1h)
20. ✅ **LANCEMENT ! 🚀**

---

## 📞 AIDE

**Bloqué quelque part ?**

1. Supabase : https://supabase.com/docs
2. Stripe : https://stripe.com/docs
3. Next.js : https://nextjs.org/docs
4. Resend : https://resend.com/docs

**Ou consultez :**
- `/voyage-mystere/docs/06-STACK-TECHNIQUE-RECOMMANDATIONS.md`
- `/voyage-mystere/ACCES-ADMIN.md`

---

**Bon courage ! Vous êtes à 4 heures d'avoir un site fonctionnel ! 💪**
