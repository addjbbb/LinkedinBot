# 🎭 VOYAGE MYSTÈRE PREMIUM - Site Web Complet

> **Site e-commerce de voyages surprise haut de gamme**
> Architecture Next.js 14 + Tailwind + Supabase + Stripe

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#-vue-densemble)
2. [Documentation](#-documentation-complète)
3. [Stack Technique](#-stack-technique)
4. [Installation & Setup](#-installation--setup)
5. [Structure du Projet](#-structure-du-projet)
6. [Features Principales](#-features-principales)
7. [Roadmap](#-roadmap)
8. [Contribution](#-contribution)
9. [License](#-license)

---

## 🎯 VUE D'ENSEMBLE

**Voyage Mystère Premium** est une plateforme e-commerce innovante qui permet aux couples de réserver des week-ends surprise haut de gamme. La destination reste secrète jusqu'à 48h avant le départ.

### Concept

- 🎁 **Mystère total** : Le client choisit un thème (Romantique, Nature, Urbain) mais découvre la destination seulement 48h avant
- 📦 **Boîte mystère** : Une boîte scellée est livrée 10 jours avant avec le code révélé J-2
- 🎯 **Personnalisation** : Questionnaire intelligent qui adapte le voyage aux goûts du couple
- 💎 **Premium** : Hébergements d'exception, activités signature, carnet de voyage sur-mesure

### Cible

- Couples 25-45 ans
- CSP+
- Friands d'expériences mémorables
- Budget : 700-1500€ le week-end

---

## 📚 DOCUMENTATION COMPLÈTE

Toute la documentation se trouve dans `/docs/` :

| Document | Description |
|----------|-------------|
| **[01-ARCHITECTURE.md](docs/01-ARCHITECTURE.md)** | Arborescence complète, parcours utilisateurs, navigation, analytics |
| **[02-DESIGN-SYSTEM.md](docs/02-DESIGN-SYSTEM.md)** | Palette couleurs, typographie, composants UI, animations, accessibilité |
| **[03-COPYWRITING-COMPLET.md](docs/03-COPYWRITING-COMPLET.md)** | Copywriting de toutes les pages (Homepage, Destinations, Comment ça marche) |
| **[04-FAQ-TEMOIGNAGES-OFFRIR.md](docs/04-FAQ-TEMOIGNAGES-OFFRIR.md)** | FAQ 30 questions, témoignages, page carte cadeau |
| **[05-QUESTIONNAIRE-TUNNEL-RESERVATION.md](docs/05-QUESTIONNAIRE-TUNNEL-RESERVATION.md)** | Questionnaire 15 questions, tunnel de réservation 6 étapes |
| **[06-STACK-TECHNIQUE-RECOMMANDATIONS.md](docs/06-STACK-TECHNIQUE-RECOMMANDATIONS.md)** | Comparatif technologies, stack recommandée, hébergement, sécurité, SEO |
| **[07-GUIDE-MAINTENANCE.md](docs/07-GUIDE-MAINTENANCE.md)** | Guide d'utilisation pour modifier le site sans compétences dev |

---

## 🛠️ STACK TECHNIQUE

### Frontend
- **Framework** : Next.js 14 (App Router)
- **UI** : React 18 + TypeScript
- **Styling** : Tailwind CSS 3.4
- **Composants** : Headless UI + Radix UI
- **Animations** : Framer Motion
- **Forms** : React Hook Form + Zod
- **Icons** : Lucide React

### Backend
- **Runtime** : Next.js API Routes + Server Actions
- **Database** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth
- **CMS** : Sanity.io (Headless CMS)
- **Storage** : Cloudinary (Images/Vidéos)

### Services
- **Paiement** : Stripe Checkout + Webhooks
- **Emails** : Resend + React Email
- **Analytics** : Google Analytics 4 + Microsoft Clarity
- **Monitoring** : Sentry

### DevOps
- **Hébergement** : Vercel
- **CI/CD** : Vercel (auto-deploy depuis GitHub)
- **Domaine** : Cloudflare DNS
- **SSL** : Automatique (Let's Encrypt via Vercel)

---

## 🚀 INSTALLATION & SETUP

### Prérequis

- Node.js 18+ (recommandé: 20 LTS)
- npm ou pnpm
- Git
- Compte Vercel (gratuit)
- Compte Supabase (gratuit)
- Compte Stripe (test mode gratuit)

### Installation Locale

```bash
# 1. Cloner le repo
git clone https://github.com/votre-username/voyage-mystere.git
cd voyage-mystere

# 2. Installer les dépendances
npm install
# ou
pnpm install

# 3. Copier les variables d'environnement
cp .env.example .env.local

# 4. Configurer les variables dans .env.local
# (Voir section "Variables d'Environnement" ci-dessous)

# 5. Lancer le serveur de développement
npm run dev

# 6. Ouvrir http://localhost:3000
```

### Variables d'Environnement

Créer un fichier `.env.local` :

```env
# Next.js
NEXT_PUBLIC_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Resend (Emails)
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=hello@voyagemystere.com

# Cloudinary (Images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxxxx

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Setup Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier l'URL et l'Anon Key
3. Exécuter le SQL de création des tables :

```bash
# Les schémas SQL sont dans /supabase/migrations/
npm run supabase:migrate
```

Ou manuellement dans le SQL Editor de Supabase (copier le contenu de `docs/06-STACK-TECHNIQUE-RECOMMANDATIONS.md` section "Base de données")

### Setup Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Mode Test activé par défaut
3. Copier les clés API (Dashboard > Developers > API keys)
4. Créer un webhook :
   - URL: `https://votre-domaine.com/api/stripe/webhook`
   - Events: `checkout.session.completed`
   - Copier le Webhook Secret

### Setup Sanity CMS

```bash
# Installer Sanity CLI
npm install -g @sanity/cli

# Se connecter
sanity login

# Initialiser le projet Sanity
cd sanity
sanity init

# Lancer le Studio localement
sanity dev
# Ouvrir http://localhost:3333
```

---

## 📁 STRUCTURE DU PROJET

```
voyage-mystere/
├── app/                          # Next.js 14 App Router
│   ├── (marketing)/              # Routes publiques
│   │   ├── page.tsx              # Homepage
│   │   ├── comment-ca-marche/
│   │   ├── destinations/
│   │   │   ├── page.tsx          # Hub destinations
│   │   │   ├── romantique/
│   │   │   ├── nature/
│   │   │   └── urbain/
│   │   ├── temoignages/
│   │   ├── faq/
│   │   ├── offrir/
│   │   ├── blog/
│   │   ├── contact/
│   │   └── layout.tsx
│   ├── reserver/                 # Tunnel de réservation
│   │   ├── page.tsx              # Étape 1: Sélection
│   │   ├── questionnaire/        # Étape 2
│   │   ├── recapitulatif/        # Étape 3
│   │   ├── informations/         # Étape 4
│   │   ├── paiement/             # Étape 5
│   │   ├── confirmation/         # Étape 6
│   │   └── layout.tsx
│   ├── espace-client/            # Dashboard client (auth requis)
│   │   ├── tableau-de-bord/
│   │   ├── ma-reservation/
│   │   ├── mes-informations/
│   │   └── layout.tsx
│   ├── api/                      # API Routes
│   │   ├── stripe/
│   │   │   ├── create-checkout/
│   │   │   └── webhook/
│   │   ├── booking/
│   │   ├── questionnaire/
│   │   └── emails/
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Styles globaux
├── components/                   # Composants React
│   ├── ui/                       # Composants UI de base
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   ├── marketing/                # Composants pages marketing
│   │   ├── hero.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq-accordion.tsx
│   │   └── ...
│   ├── booking/                  # Composants réservation
│   │   ├── theme-selector.tsx
│   │   ├── calendar.tsx
│   │   ├── questionnaire/
│   │   └── payment-form.tsx
│   └── dashboard/                # Composants espace client
│       └── ...
├── lib/                          # Utilitaires
│   ├── supabase.ts               # Client Supabase
│   ├── stripe.ts                 # Client Stripe
│   ├── emails.ts                 # Templates emails
│   ├── analytics.ts              # Helpers analytics
│   └── utils.ts
├── emails/                       # Templates React Email
│   ├── confirmation.tsx
│   ├── box-shipped.tsx
│   ├── reveal-code.tsx
│   └── review-request.tsx
├── public/                       # Assets statiques
│   ├── images/
│   ├── videos/
│   └── fonts/
├── sanity/                       # Sanity CMS
│   ├── schemas/
│   │   ├── blog-post.ts
│   │   ├── testimonial.ts
│   │   └── ...
│   └── sanity.config.ts
├── supabase/                     # Migrations Supabase
│   └── migrations/
│       └── 001_initial_schema.sql
├── docs/                         # Documentation
│   ├── 01-ARCHITECTURE.md
│   ├── 02-DESIGN-SYSTEM.md
│   ├── 03-COPYWRITING-COMPLET.md
│   ├── 04-FAQ-TEMOIGNAGES-OFFRIR.md
│   ├── 05-QUESTIONNAIRE-TUNNEL-RESERVATION.md
│   ├── 06-STACK-TECHNIQUE-RECOMMANDATIONS.md
│   └── 07-GUIDE-MAINTENANCE.md
├── .env.example                  # Template variables d'env
├── .env.local                    # Variables locales (git ignored)
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## ✨ FEATURES PRINCIPALES

### 🎯 MVP (Phase 1) - IMPLÉMENTÉ

- [x] Homepage avec hero, thématiques, témoignages, FAQ
- [x] Pages destinations (Romantique, Nature, Urbain)
- [x] Page "Comment ça marche" complète
- [x] Page FAQ (30 questions)
- [x] Page Témoignages avec filtres
- [x] Page Offrir / Carte Cadeau
- [x] Tunnel de réservation 6 étapes
- [x] Questionnaire de personnalisation (15 questions)
- [x] Intégration Stripe (paiement sécurisé)
- [x] Système d'emails automatiques (confirmation, J-10, J-2...)
- [x] Espace client (voir réservation, infos, carnet voyage)
- [x] Blog avec articles SEO
- [x] Design system complet
- [x] Responsive mobile-first
- [x] SEO optimisé (meta tags, sitemap, schema markup)
- [x] Analytics (GA4, Clarity)

### 🚀 Phase 2 - ROADMAP

- [ ] Carte interactive des destinations (sans dévoiler)
- [ ] Programme de parrainage automatisé (tableau de bord)
- [ ] Quiz "Quelle destination pour vous ?"
- [ ] Système de wishlist / Save for later
- [ ] Comparateur de formules (side-by-side)
- [ ] Compte à rebours personnalisé "J-X avant révélation"
- [ ] Intégration chat (Crisp ou Intercom)
- [ ] Génération automatique PDF carnet de voyage
- [ ] Upload photos voyageurs (galerie communautaire)
- [ ] Système de reviews (TrustPilot embed + interne)

### 🔮 Phase 3 - INNOVATION

- [ ] Abonnement "Mystère récurrent" (1 voyage/trimestre)
- [ ] App mobile (React Native)
- [ ] Réalité Augmentée : Scanner la boîte pour indices 3D
- [ ] IA pour recommandations ultra-personnalisées
- [ ] Marketplace : Partenaires locaux (restos, activités)
- [ ] Voyage Mystère Groupe (4-8 personnes)
- [ ] Destinations internationales lointaines (Asie, Amérique)

---

## 🎨 DESIGN & UX

### Palette de Couleurs

- **Primary (Bleu Mystère)** : `#3B82F6`
- **Accent (Orange Sunset)** : `#F97316`
- **Success** : `#10B981`
- **Error** : `#F43F5E`
- **Neutrals** : Échelle de gris 50-900

### Typographie

- **Headings** : Poppins (Bold 700, SemiBold 600)
- **Body** : Inter (Regular 400, Medium 500)
- **Accent** : Dancing Script (citations)

### Composants UI

Tous les composants sont documentés dans `docs/02-DESIGN-SYSTEM.md` :
- Boutons (Primary, Secondary, Ghost)
- Cards (Produit, Témoignage)
- Formulaires (Inputs, Selects, Checkboxes, Radios)
- Modals
- Alerts / Toasts
- Badges

---

## 📊 MÉTRIQUES DE SUCCÈS

### Objectifs Conversion

- **Taux de conversion** : 3-5% des visiteurs en acheteurs
- **Temps sur site** : > 3 minutes
- **Taux de rebond** : < 50%
- **Panier moyen** : > 900€
- **Newsletter signup** : 30% des visiteurs

### Performance

- **Lighthouse Performance** : > 95/100
- **Lighthouse SEO** : 100/100
- **Lighthouse Accessibility** : 100/100
- **Core Web Vitals** : Tous au vert

### Business

- **Première vente** : Semaine 1
- **Break-even** : 50 voyages vendus (~45K€)
- **Objectif Année 1** : 200 voyages (~180K€)

---

## 🧪 TESTS

```bash
# Lancer les tests unitaires
npm run test

# Lancer les tests E2E (Playwright)
npm run test:e2e

# Lancer les tests de performance (Lighthouse CI)
npm run lighthouse

# Vérifier l'accessibilité
npm run a11y
```

---

## 📦 DÉPLOIEMENT

### Production (Vercel)

```bash
# 1. Push sur la branche main
git push origin main

# 2. Vercel déploie automatiquement
# URL: https://voyage-mystere.vercel.app

# 3. Configurer le domaine custom
# Dans Vercel Dashboard > Settings > Domains
# Ajouter: voyagemystere.com

# 4. Configurer les variables d'environnement PRODUCTION
# Dans Vercel Dashboard > Settings > Environment Variables
```

### Migrations Database

```bash
# Appliquer les migrations Supabase en production
npm run supabase:migrate:prod
```

---

## 🛠️ COMMANDES UTILES

```bash
# Développement
npm run dev              # Lancer le serveur local
npm run build            # Build de production
npm run start            # Serveur de production local
npm run lint             # Linter (ESLint)
npm run format           # Formatter (Prettier)

# Sanity CMS
npm run sanity:dev       # Lancer Sanity Studio localement
npm run sanity:deploy    # Déployer Sanity Studio en production

# Database
npm run supabase:migrate # Appliquer les migrations
npm run supabase:reset   # Reset la DB locale

# Emails
npm run email:dev        # Prévisualiser les emails (React Email)
```

---

## 🤝 CONTRIBUTION

Si vous souhaitez contribuer au projet :

1. Fork le repo
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

**Guidelines:**
- Suivre le Design System (docs/02-DESIGN-SYSTEM.md)
- Écrire des tests pour les nouvelles features
- Mettre à jour la documentation si nécessaire
- Respecter les conventions de code (ESLint + Prettier)

---

## 📞 SUPPORT

**Email** : hello@voyagemystere.com
**Documentation** : [docs/](docs/)
**Issues** : [GitHub Issues](https://github.com/votre-username/voyage-mystere/issues)

---

## 📄 LICENSE

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 CRÉDITS

**Développé par** : [Votre Nom]
**Design inspiré par** : Hinterhof, Srprs.me, Uwilo
**Stack** : Next.js 14, Tailwind CSS, Supabase, Stripe
**Hébergement** : Vercel

---

## 🎉 CHANGELOG

### Version 1.0.0 (Novembre 2024)

- ✅ MVP complet
- ✅ Documentation exhaustive
- ✅ Design system
- ✅ Tunnel de réservation 6 étapes
- ✅ Questionnaire 15 questions
- ✅ Intégration Stripe
- ✅ Emails automatiques
- ✅ SEO optimisé
- ✅ Mobile-first responsive
- ✅ Analytics GA4

---

**Made with ❤️ and ✨ mystery**

Bon voyage ! 🚀
