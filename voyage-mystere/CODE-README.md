# 💻 VOYAGE MYSTÈRE - CODE SOURCE NEXT.JS

> **Implémentation Next.js 14 du site Voyage Mystère Premium**

---

## 📦 CE QUI A ÉTÉ CRÉÉ

### ✅ Configuration & Structure de Base

**Fichiers de configuration:**
- ✅ `package.json` - Dépendances Next.js 14, React 18, Tailwind, TypeScript
- ✅ `tsconfig.json` - Configuration TypeScript avec path aliases
- ✅ `tailwind.config.ts` - Design system complet (couleurs, fonts, animations)
- ✅ `next.config.js` - Configuration Next.js (images, headers sécurité)
- ✅ `postcss.config.js` - Configuration PostCSS pour Tailwind
- ✅ `.gitignore` - Fichiers à ignorer
- ✅ `.env.example` - Template variables d'environnement

**Styles globaux:**
- ✅ `app/globals.css` - Styles Tailwind + polices Google Fonts (Poppins, Inter, Dancing Script)

---

## 🎨 DESIGN SYSTEM IMPLÉMENTÉ

### Couleurs (Tailwind Config)

**Primary - Mystère Blue:**
- `primary-500: #3B82F6` (couleur principale)
- Échelle complète de 50 à 900

**Accent - Sunset Orange:**
- `accent-500: #F97316` (CTA, urgence)
- Échelle complète de 50 à 900

**Couleurs sémantiques:**
- Success (vert), Error (rouge), Warning (jaune)

### Typographie

**Fonts:**
- Headings: `Poppins` (600, 700)
- Body: `Inter` (400, 500, 600)
- Accent: `Dancing Script` (400, 700)

**Tailles:** Échelle responsive (xs à 6xl)

### Animations

**Keyframes Tailwind:**
- `fadeIn` - Apparition en fondu
- `slideUp` - Glissement du bas
- `slideInRight` - Entrée par la droite
- `bounce-slow` / `pulse-slow` - Animations douces

---

## 🧩 COMPOSANTS UI CRÉÉS

### `components/ui/button.tsx`

Composant Button avec 4 variantes et 4 tailles:

**Variantes:**
- `primary` - Bouton principal (orange accent)
- `secondary` - Bouton secondaire (outline bleu)
- `ghost` - Bouton transparent
- `outline` - Bouton avec bordure grise

**Tailles:** `sm`, `md`, `lg`, `xl`

**Features:**
- État loading avec spinner
- Disabled state
- Hover effects (lift, shadow)
- Fully accessible

**Exemple d'utilisation:**
```tsx
<Button variant="primary" size="lg">
  Réserver maintenant
</Button>

<Button variant="secondary" size="md" isLoading>
  Chargement...
</Button>
```

---

### `components/ui/card.tsx`

Composants Card modulaires:

**Composants:**
- `<Card>` - Conteneur principal avec hover effect optionnel
- `<CardHeader>` - En-tête de card
- `<CardBody>` - Corps de card
- `<CardFooter>` - Pied de card (avec bordure top)

**Features:**
- Shadow et border
- Hover lift effect (optionnel)
- Responsive padding

**Exemple:**
```tsx
<Card hover>
  <CardHeader>
    <h3>Titre</h3>
  </CardHeader>
  <CardBody>
    <p>Contenu...</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## 📄 PAGES CRÉÉES

### `app/layout.tsx` - Root Layout

**Features:**
- Fonts optimisées (Google Fonts avec `next/font`)
- Meta tags SEO globaux
- Variables CSS pour fonts
- Body avec classes Tailwind

**Meta tags:**
- Title: "Voyage Mystère Premium - Week-end Surprise Haut de Gamme"
- Description complète
- Keywords
- Open Graph

---

### `app/page.tsx` - Homepage Complète

**Sections implémentées:**

#### 1. Hero Section
- Titre principal avec gradient de couleurs
- Sous-titre descriptif
- 2 CTAs (primaire + secondaire)
- 3 réassurances (annulation, paiement, satisfaction)
- Background gradient (bleu → blanc → orange)
- Animation slideUp sur le titre

#### 2. Pourquoi Voyage Mystère
- Titre H2 centré
- 3 features en grid responsive:
  - **Émotion de la surprise** (icône Sparkles)
  - **100% personnalisé** (icône Target)
  - **Tout inclus** (icône Trophy)
- Icônes Lucide React avec backgrounds colorés
- Copywriting complet de la documentation

#### 3. Comment ça marche
- Timeline verticale 3 étapes
- Numérotation dans des cercles colorés
- Icônes de durée (5 min, J-10, J-2)
- CTA "Voir le processus en détail"

#### 4. Nos Thématiques
- Grid 3 colonnes (responsive: 1 col mobile, 3 cols desktop)
- **3 Cards thématiques:**

  **Romantique (890€):**
  - Badge "Le plus demandé"
  - Icône Heart + gradient rose
  - Liste inclus (3 items)
  - Prix mis en valeur
  - CTA "Découvrir"

  **Nature (750€):**
  - Badge "Aventuriers"
  - Icône Trees + gradient vert
  - Liste inclus (3 items)
  - Prix mis en valeur
  - CTA "Découvrir"

  **Urbain (820€):**
  - Badge "Culture & Foodie"
  - Icône Building2 + gradient bleu
  - Liste inclus (3 items)
  - Prix mis en valeur
  - CTA "Découvrir"

#### 5. CTA Final
- Background gradient bleu primary
- Texte blanc
- Titre H2 + sous-titre
- Bouton XL secondary
- 3 réassurances en footer

**Total: ~150 lignes de JSX avec tout le copywriting de la documentation**

---

## 🛠️ UTILITAIRES (lib/)

### `lib/utils.ts`

**Fonctions utilitaires:**

```typescript
// Merge Tailwind classes
cn(...inputs)

// Format prix en euros
formatPrice(890) // "890 €"

// Format date française
formatDate(new Date()) // "9 novembre 2024"

// Format range de dates
formatDateRange(start, end) // "14 juin → 16 juin 2024"

// Scroll vers élément
scrollToElement('section-id')

// Debounce
debounce(func, 300)

// Générer numéro réservation
generateBookingNumber() // "VM-2024-11-1234"

// Jours jusqu'à date
daysUntil(date) // 30

// Vérifier date future
isFutureDate(date) // true/false

// Couleur thème
getThemeColor('romantique') // "bg-pink-100 text-pink-700..."

// Emoji thème
getThemeEmoji('nature') // "🌲"
```

---

### `lib/pricing.ts`

**Configuration tarifs:**

```typescript
pricing = {
  themes: {
    romantique: 890,
    nature: 750,
    urbain: 820,
  },
  options: {
    upgradeSuite: 150,
    champagne: 40,
    photoshoot: 150,
    basket: 45,
  },
  stripe: { /* prix en centimes */ },
  giftCards: {
    presets: [700, 900, 1200, 1500],
    min: 500,
    max: 2000,
  },
}

// Fonctions helpers
getThemePrice('romantique') // 890
calculateTotal('romantique', { champagne: true }) // 930
getStripePriceId('nature') // 'price_nature_750'
```

---

## 📁 STRUCTURE DU PROJET

```
voyage-mystere/
├── app/
│   ├── globals.css          # Styles globaux + Tailwind
│   ├── layout.tsx            # Root layout avec meta SEO
│   └── page.tsx              # Homepage complète
│
├── components/
│   └── ui/
│       ├── button.tsx        # Composant Button (4 variantes)
│       └── card.tsx          # Composants Card modulaires
│
├── lib/
│   ├── utils.ts              # Fonctions utilitaires (15+)
│   └── pricing.ts            # Configuration tarifs
│
├── public/                   # Assets statiques (vide pour l'instant)
│
├── docs/                     # Documentation complète (7 docs)
│
├── .env.example              # Template variables d'env
├── .gitignore                # Fichiers ignorés
├── next.config.js            # Config Next.js
├── package.json              # Dépendances
├── postcss.config.js         # Config PostCSS
├── tailwind.config.ts        # Design system Tailwind
├── tsconfig.json             # Config TypeScript
├── README.md                 # Documentation projet
└── SUMMARY.md                # Synthèse complète
```

---

## 🚀 INSTALLATION & LANCEMENT

### 1. Installer les dépendances

```bash
cd voyage-mystere
npm install
```

### 2. Créer .env.local

```bash
cp .env.example .env.local
# Puis remplir les variables
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📊 STATISTIQUES CODE

**Fichiers créés:** 13 fichiers
**Lignes de code:** ~600 lignes (sans les docs)
**Composants:** 2 composants UI de base
**Fonctions utilitaires:** 15 fonctions
**Sections homepage:** 5 sections complètes

---

## ✅ CE QUI EST FONCTIONNEL

- ✅ Homepage s'affiche avec tous les styles
- ✅ Design system Tailwind opérationnel
- ✅ Composants UI réutilisables
- ✅ Responsive mobile-first
- ✅ Animations Tailwind
- ✅ SEO meta tags
- ✅ Accessibilité (focus states, semantic HTML)
- ✅ TypeScript configuré
- ✅ Polices Google Fonts chargées

---

## 🔜 PROCHAINES ÉTAPES

### Pages à créer:

- [ ] `/comment-ca-marche` - Page process détaillé 7 étapes
- [ ] `/destinations/*` - Pages thématiques (Romantique, Nature, Urbain)
- [ ] `/faq` - FAQ 30 questions avec accordéon
- [ ] `/temoignages` - Témoignages avec filtres
- [ ] `/offrir` - Page carte cadeau
- [ ] `/blog` - Structure blog + articles

### Tunnel de réservation:

- [ ] `/reserver` - Sélection thème + dates
- [ ] `/reserver/questionnaire` - 15 questions
- [ ] `/reserver/recapitulatif` - Résumé + social proof
- [ ] `/reserver/informations` - Coordonnées
- [ ] `/reserver/paiement` - Intégration Stripe
- [ ] `/reserver/confirmation` - Confirmation + next steps

### Fonctionnalités:

- [ ] Intégration Supabase (database)
- [ ] Intégration Stripe (paiement)
- [ ] Système emails automatiques (Resend)
- [ ] CMS Sanity pour contenu
- [ ] Espace client
- [ ] Analytics (GA4, Clarity)

### Composants UI manquants:

- [ ] Input (text, email, tel, textarea)
- [ ] Select / Dropdown
- [ ] Checkbox / Radio
- [ ] Modal / Dialog
- [ ] Accordion (pour FAQ)
- [ ] Tabs
- [ ] Badge
- [ ] Alert / Toast
- [ ] Navbar / Footer
- [ ] Calendrier (sélection dates)

---

## 💡 COMMENT UTILISER CE CODE

### Développer localement:

```bash
# Installer les dépendances
npm install

# Lancer en dev (hot reload)
npm run dev

# Build de production
npm run build

# Lancer le build
npm start

# Linter
npm run lint
```

### Ajouter un nouveau composant:

```bash
# Créer le fichier
touch components/ui/input.tsx

# Structure type:
import { cn } from '@/lib/utils'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full px-4 py-3 rounded-lg border-2...",
        className
      )}
      {...props}
    />
  )
}
```

### Ajouter une nouvelle page:

```bash
# Créer le dossier
mkdir -p app/faq

# Créer page.tsx
touch app/faq/page.tsx

# Structure:
export default function FAQPage() {
  return <div>FAQ Content</div>
}
```

---

## 🎯 OBJECTIFS ATTEINTS

**Phase 1: Setup & Homepage ✅**

- ✅ Projet Next.js 14 initialisé
- ✅ Tailwind configuré avec design system
- ✅ Composants UI de base
- ✅ Homepage complète avec copywriting
- ✅ Responsive mobile-first
- ✅ TypeScript
- ✅ SEO basics

**Temps estimé:** ~3-4 heures pour un dev expérimenté Next.js

---

## 📞 RESSOURCES

**Documentation:**
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)

**Toute la documentation projet:**
- Voir `/docs/` pour les 7 documents complets
- Voir `README.md` pour vue d'ensemble
- Voir `SUMMARY.md` pour la synthèse

---

**🎉 Le code est prêt ! Il suffit de continuer avec les autres pages et intégrations.**

*Créé avec Next.js 14, React 18, TypeScript & Tailwind CSS*
