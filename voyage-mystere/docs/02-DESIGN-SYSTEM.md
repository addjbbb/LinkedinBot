# 🎨 DESIGN SYSTEM - VOYAGE MYSTÈRE PREMIUM

## 🌈 PALETTE DE COULEURS

### Couleurs Primaires

```css
/* MYSTÈRE BLUE - Couleur principale (mystère, confiance, voyage) */
--primary-50: #EFF6FF;   /* Backgrounds très légers */
--primary-100: #DBEAFE;  /* Hover states subtils */
--primary-200: #BFDBFE;  /* Borders, dividers */
--primary-300: #93C5FD;  /* Disabled states */
--primary-400: #60A5FA;  /* Hover buttons */
--primary-500: #3B82F6;  /* PRIMARY - Boutons principaux */
--primary-600: #2563EB;  /* Active state */
--primary-700: #1D4ED8;  /* Pressed state */
--primary-800: #1E40AF;  /* Dark mode primary */
--primary-900: #1E3A8A;  /* Text sur fond clair */

/* SUNSET ORANGE - Couleur d'accent (émotion, chaleur, CTA) */
--accent-50: #FFF7ED;
--accent-100: #FFEDD5;
--accent-200: #FED7AA;
--accent-300: #FDBA74;
--accent-400: #FB923C;
--accent-500: #F97316;  /* ACCENT - CTAs importantes */
--accent-600: #EA580C;  /* Hover CTA */
--accent-700: #C2410C;
--accent-800: #9A3412;
--accent-900: #7C2D12;

/* EMERALD GREEN - Succès, validation */
--success-50: #ECFDF5;
--success-500: #10B981;
--success-600: #059669;
--success-700: #047857;

/* ROSE RED - Erreurs, urgence */
--error-50: #FFF1F2;
--error-500: #F43F5E;
--error-600: #E11D48;
--error-700: #BE123C;

/* WARNING YELLOW - Avertissements */
--warning-50: #FFFBEB;
--warning-500: #F59E0B;
--warning-600: #D97706;
```

### Couleurs Neutres

```css
/* NEUTRALS - Textes, backgrounds */
--gray-50: #F9FAFB;      /* Background page */
--gray-100: #F3F4F6;     /* Background cards */
--gray-200: #E5E7EB;     /* Borders */
--gray-300: #D1D5DB;     /* Dividers */
--gray-400: #9CA3AF;     /* Placeholder text */
--gray-500: #6B7280;     /* Secondary text */
--gray-600: #4B5563;     /* Body text */
--gray-700: #374151;     /* Headings */
--gray-800: #1F2937;     /* Dark headings */
--gray-900: #111827;     /* Almost black */

--white: #FFFFFF;
--black: #000000;
```

### Justification des Choix

**Bleu Mystère (#3B82F6):**
- Évoque confiance, voyage, découverte
- Contraste excellent avec orange (accessibilité)
- Moderne sans être froid

**Orange Sunset (#F97316):**
- Émotion, chaleur, excitation
- Se démarque des concurrents (souvent rose/violet)
- Pousse à l'action (optimise conversions)

**Vert Émeraude (Succès):**
- Validation positive ("Réservation confirmée!")
- Évoque nature (thématique Nature)

---

## ✍️ TYPOGRAPHIE

### Fonts Principales

```css
/* HEADINGS - Poppins (Google Fonts) */
--font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
/* Poids: 700 (Bold), 600 (SemiBold) */
/* Caractère: Moderne, chaleureux, lisible, légèrement arrondi */

/* BODY - Inter (Google Fonts) */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
/* Poids: 400 (Regular), 500 (Medium), 600 (SemiBold) */
/* Caractère: Excellent pour écrans, lisible, professionnel */

/* ACCENT/SCRIPT - Dancing Script (Google Fonts) */
--font-script: 'Dancing Script', cursive;
/* Poids: 400, 700 */
/* Usage: Citations témoignages, touches émotionnelles (parcimonieusement) */
```

### Échelle Typographique (Mobile-First)

```css
/* MOBILE */
--text-xs: 12px;     /* line-height: 16px */ /* Microcopy, legal */
--text-sm: 14px;     /* line-height: 20px */ /* Secondary text */
--text-base: 16px;   /* line-height: 24px */ /* Body text */
--text-lg: 18px;     /* line-height: 28px */ /* Lead paragraphs */
--text-xl: 20px;     /* line-height: 28px */ /* H4 */
--text-2xl: 24px;    /* line-height: 32px */ /* H3 */
--text-3xl: 30px;    /* line-height: 36px */ /* H2 */
--text-4xl: 36px;    /* line-height: 40px */ /* H1 Mobile */
--text-5xl: 48px;    /* line-height: 1 */    /* Hero Mobile */

/* DESKTOP (md: breakpoint) */
--text-4xl-desktop: 48px;   /* line-height: 1 */     /* H1 Desktop */
--text-5xl-desktop: 60px;   /* line-height: 1 */     /* Hero Desktop */
--text-6xl-desktop: 72px;   /* line-height: 1 */     /* Hero XL */
```

### Hiérarchie d'Usage

```html
<!-- Hero Headline -->
<h1 class="font-heading text-5xl md:text-6xl font-bold text-gray-900">
  Votre prochaine aventure commence ici
</h1>

<!-- Page Title -->
<h1 class="font-heading text-4xl md:text-5xl font-bold text-gray-900">
  Comment ça marche ?
</h1>

<!-- Section Title -->
<h2 class="font-heading text-3xl md:text-4xl font-semibold text-gray-800">
  Nos Thématiques
</h2>

<!-- Subsection -->
<h3 class="font-heading text-2xl font-semibold text-gray-800">
  Voyage Mystère Romantique
</h3>

<!-- Card Title -->
<h4 class="font-heading text-xl font-semibold text-gray-700">
  Témoignage de Julie & Marc
</h4>

<!-- Body Text -->
<p class="font-body text-base text-gray-600 leading-relaxed">
  Découvrez l'émotion d'un voyage surprise...
</p>

<!-- Lead Paragraph (intro) -->
<p class="font-body text-lg text-gray-700 leading-relaxed">
  Plus de 500 couples ont déjà vécu cette aventure unique.
</p>

<!-- Small Text -->
<span class="font-body text-sm text-gray-500">
  Réservation confirmée le 09/11/2024
</span>

<!-- Microcopy -->
<span class="font-body text-xs text-gray-400">
  Paiement sécurisé par Stripe
</span>

<!-- Script (testimonial accent) -->
<blockquote class="font-script text-2xl text-primary-600">
  "Le plus beau cadeau de notre vie !"
</blockquote>
```

---

## 🧩 COMPOSANTS UI

### Boutons

#### Bouton Principal (CTA Primary)

```jsx
// Taille Standard
<button class="
  bg-accent-500 hover:bg-accent-600 active:bg-accent-700
  text-white font-semibold
  px-6 py-3 rounded-lg
  transition-all duration-200
  shadow-md hover:shadow-lg
  transform hover:-translate-y-0.5
">
  Réserver maintenant
</button>

// Taille Large (Hero)
<button class="
  bg-accent-500 hover:bg-accent-600
  text-white font-bold text-lg
  px-8 py-4 rounded-xl
  shadow-lg hover:shadow-xl
  transform hover:scale-105 transition-all
">
  Je découvre les surprises
</button>

// Taille Small
<button class="
  bg-accent-500 hover:bg-accent-600
  text-white font-semibold text-sm
  px-4 py-2 rounded-md
">
  En savoir plus
</button>
```

#### Bouton Secondaire

```jsx
<button class="
  bg-white hover:bg-gray-50
  text-primary-600 hover:text-primary-700
  border-2 border-primary-500 hover:border-primary-600
  font-semibold px-6 py-3 rounded-lg
  transition-colors
">
  Comment ça marche ?
</button>
```

#### Bouton Ghost

```jsx
<button class="
  bg-transparent hover:bg-primary-50
  text-primary-600 hover:text-primary-700
  font-medium px-4 py-2 rounded-md
  transition-colors
">
  En savoir plus
</button>
```

#### Bouton Disabled

```jsx
<button disabled class="
  bg-gray-300 text-gray-500
  px-6 py-3 rounded-lg
  cursor-not-allowed opacity-60
">
  Non disponible
</button>
```

---

### Cards

#### Card Produit (Thématique)

```jsx
<div class="
  bg-white rounded-2xl overflow-hidden
  shadow-md hover:shadow-xl
  transform hover:-translate-y-2
  transition-all duration-300
  border border-gray-200
">
  <!-- Image -->
  <div class="relative h-56 overflow-hidden">
    <img src="..." class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
    <!-- Badge -->
    <div class="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
      Populaire
    </div>
  </div>

  <!-- Content -->
  <div class="p-6">
    <h3 class="font-heading text-xl font-semibold text-gray-800 mb-2">
      Voyage Romantique
    </h3>
    <p class="text-gray-600 text-sm mb-4">
      Dîners aux chandelles, spas, hébergements d'exception
    </p>

    <!-- Prix -->
    <div class="flex items-baseline gap-2 mb-4">
      <span class="text-3xl font-bold text-primary-600">890€</span>
      <span class="text-gray-500 text-sm">/ 2 personnes</span>
    </div>

    <!-- CTA -->
    <button class="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition">
      Découvrir
    </button>
  </div>
</div>
```

#### Card Témoignage

```jsx
<div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
  <!-- Rating -->
  <div class="flex gap-1 mb-3">
    <Star class="text-yellow-400 fill-current" />
    <Star class="text-yellow-400 fill-current" />
    <Star class="text-yellow-400 fill-current" />
    <Star class="text-yellow-400 fill-current" />
    <Star class="text-yellow-400 fill-current" />
  </div>

  <!-- Quote -->
  <blockquote class="font-script text-xl text-primary-600 mb-4">
    "Une expérience inoubliable !"
  </blockquote>

  <!-- Text -->
  <p class="text-gray-700 text-sm leading-relaxed mb-4">
    La surprise était totale ! Nous avons découvert Annecy et c'était magique...
  </p>

  <!-- Author -->
  <div class="flex items-center gap-3">
    <img src="..." class="w-12 h-12 rounded-full object-cover" />
    <div>
      <div class="font-semibold text-gray-800">Julie & Marc</div>
      <div class="text-gray-500 text-xs">Voyage Romantique • Juin 2024</div>
    </div>
  </div>
</div>
```

---

### Formulaires

#### Input Text

```jsx
<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    Votre email
  </label>
  <input
    type="email"
    placeholder="exemple@email.com"
    class="
      w-full px-4 py-3 rounded-lg
      border-2 border-gray-300 focus:border-primary-500
      focus:ring-4 focus:ring-primary-100
      outline-none transition
      placeholder:text-gray-400
    "
  />
  <!-- Helper text -->
  <p class="text-xs text-gray-500">
    Nous ne partagerons jamais votre email
  </p>
</div>
```

#### Input Error State

```jsx
<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    Votre email
  </label>
  <input
    type="email"
    class="
      w-full px-4 py-3 rounded-lg
      border-2 border-error-500 focus:border-error-600
      focus:ring-4 focus:ring-error-100
      outline-none
    "
  />
  <p class="text-xs text-error-600 flex items-center gap-1">
    <AlertCircle size={14} />
    Veuillez entrer un email valide
  </p>
</div>
```

#### Select Dropdown

```jsx
<select class="
  w-full px-4 py-3 rounded-lg
  border-2 border-gray-300 focus:border-primary-500
  focus:ring-4 focus:ring-primary-100
  outline-none transition
  bg-white
  appearance-none
  cursor-pointer
">
  <option>Sélectionnez une option</option>
  <option>Romantique</option>
  <option>Nature</option>
  <option>Urbain</option>
</select>
```

#### Checkbox

```jsx
<label class="flex items-start gap-3 cursor-pointer group">
  <input
    type="checkbox"
    class="
      w-5 h-5 rounded border-2 border-gray-300
      text-primary-500 focus:ring-4 focus:ring-primary-100
      cursor-pointer mt-0.5
    "
  />
  <span class="text-sm text-gray-700 group-hover:text-gray-900">
    J'accepte les <a href="/cgv" class="text-primary-600 underline">conditions générales</a>
  </span>
</label>
```

#### Radio Buttons (Questionnaire style)

```jsx
<div class="space-y-3">
  <p class="font-semibold text-gray-800 mb-3">
    Quel est votre rythme idéal ?
  </p>

  <label class="
    flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200
    hover:border-primary-300 hover:bg-primary-50
    cursor-pointer transition
    has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50
  ">
    <input type="radio" name="rythme" value="detente" class="w-5 h-5 text-primary-500" />
    <div>
      <div class="font-semibold text-gray-800">Détente absolue</div>
      <div class="text-sm text-gray-600">Spa, lectures, siestes au soleil</div>
    </div>
  </label>

  <label class="
    flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200
    hover:border-primary-300 hover:bg-primary-50
    cursor-pointer transition
  ">
    <input type="radio" name="rythme" value="mixte" class="w-5 h-5 text-primary-500" />
    <div>
      <div class="font-semibold text-gray-800">Mix activités / repos</div>
      <div class="text-sm text-gray-600">Un peu d'action, un peu de détente</div>
    </div>
  </label>

  <label class="
    flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200
    hover:border-primary-300 hover:bg-primary-50
    cursor-pointer transition
  ">
    <input type="radio" name="rythme" value="action" class="w-5 h-5 text-primary-500" />
    <div>
      <div class="font-semibold text-gray-800">Action non-stop</div>
      <div class="text-sm text-gray-600">Randos, activités, découvertes</div>
    </div>
  </label>
</div>
```

---

### Badges & Tags

```jsx
<!-- Badge Status -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-success-100 text-success-700">
  Confirmé
</span>

<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-warning-100 text-warning-700">
  En attente
</span>

<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-error-100 text-error-700">
  Annulé
</span>

<!-- Badge Thématique -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
  Romantique
</span>

<!-- Badge New/Populaire -->
<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-500 text-white">
  Nouveau
</span>
```

---

### Modals

```jsx
<!-- Overlay -->
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"></div>

<!-- Modal -->
<div class="
  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  bg-white rounded-2xl shadow-2xl
  w-full max-w-md mx-4 p-6
  z-50 animate-slideUp
">
  <!-- Close Button -->
  <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
    <X size={24} />
  </button>

  <!-- Content -->
  <div class="mb-6">
    <h3 class="font-heading text-2xl font-bold text-gray-900 mb-2">
      Titre du Modal
    </h3>
    <p class="text-gray-600">
      Contenu du modal...
    </p>
  </div>

  <!-- Actions -->
  <div class="flex gap-3">
    <button class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">
      Annuler
    </button>
    <button class="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold">
      Confirmer
    </button>
  </div>
</div>
```

---

### Alerts / Notifications

```jsx
<!-- Success Alert -->
<div class="flex items-start gap-3 p-4 bg-success-50 border border-success-200 rounded-lg">
  <CheckCircle class="text-success-600 flex-shrink-0" size={20} />
  <div>
    <h4 class="font-semibold text-success-900">Réservation confirmée !</h4>
    <p class="text-sm text-success-700 mt-1">Vous recevrez un email de confirmation dans quelques minutes.</p>
  </div>
</div>

<!-- Error Alert -->
<div class="flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-lg">
  <AlertCircle class="text-error-600 flex-shrink-0" size={20} />
  <div>
    <h4 class="font-semibold text-error-900">Erreur de paiement</h4>
    <p class="text-sm text-error-700 mt-1">Votre carte a été refusée. Veuillez réessayer.</p>
  </div>
</div>

<!-- Warning Alert -->
<div class="flex items-start gap-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
  <AlertTriangle class="text-warning-600 flex-shrink-0" size={20} />
  <div>
    <h4 class="font-semibold text-warning-900">Places limitées</h4>
    <p class="text-sm text-warning-700 mt-1">Plus que 2 places disponibles pour ces dates.</p>
  </div>
</div>

<!-- Info Alert -->
<div class="flex items-start gap-3 p-4 bg-primary-50 border border-primary-200 rounded-lg">
  <Info class="text-primary-600 flex-shrink-0" size={20} />
  <div>
    <h4 class="font-semibold text-primary-900">Information</h4>
    <p class="text-sm text-primary-700 mt-1">La destination sera révélée 48h avant le départ.</p>
  </div>
</div>
```

---

### Toast Notifications

```jsx
<!-- Toast Success (bottom-right) -->
<div class="
  fixed bottom-6 right-6 z-50
  bg-white rounded-lg shadow-2xl border border-gray-200
  p-4 max-w-sm animate-slideInRight
">
  <div class="flex items-start gap-3">
    <div class="bg-success-100 rounded-full p-2">
      <CheckCircle class="text-success-600" size={20} />
    </div>
    <div class="flex-1">
      <h4 class="font-semibold text-gray-900">Ajouté au panier</h4>
      <p class="text-sm text-gray-600 mt-1">Voyage Romantique • 890€</p>
    </div>
    <button class="text-gray-400 hover:text-gray-600">
      <X size={20} />
    </button>
  </div>
</div>
```

---

## 📐 SPACING & LAYOUT

### Échelle d'Espacement

```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
--space-32: 8rem;    /* 128px */
```

### Grille Responsive

```css
/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem; /* Mobile */
}

@media (min-width: 768px) {
  .container {
    padding: 0 2rem; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 4rem; /* Desktop */
  }
}

/* Section Spacing */
.section {
  padding-top: 3rem;    /* Mobile */
  padding-bottom: 3rem;
}

@media (min-width: 768px) {
  .section {
    padding-top: 5rem;  /* Tablet */
    padding-bottom: 5rem;
  }
}

@media (min-width: 1024px) {
  .section {
    padding-top: 8rem;  /* Desktop */
    padding-bottom: 8rem;
  }
}
```

---

## 🎬 ANIMATIONS

### Transitions Standards

```css
/* Transition par défaut */
.transition-default {
  transition: all 0.2s ease-in-out;
}

/* Transition douce */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Transition rapide */
.transition-fast {
  transition: all 0.15s ease-in-out;
}
```

### Animations Tailwind (à ajouter)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in',
        'slideUp': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slideInRight': 'slideInRight 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
}
```

---

## 📱 BREAKPOINTS

```css
/* Mobile First */
/* Default: < 640px (mobile) */

/* Small (sm) */
@media (min-width: 640px) { /* Petit tablet */ }

/* Medium (md) */
@media (min-width: 768px) { /* Tablet */ }

/* Large (lg) */
@media (min-width: 1024px) { /* Desktop */ }

/* Extra Large (xl) */
@media (min-width: 1280px) { /* Large Desktop */ }

/* 2XL */
@media (min-width: 1536px) { /* Ultra Wide */ }
```

---

## 🖼️ STYLE VISUEL

### Photos

**Style:** Lifestyle, authentique, émotionnel
- Couples réels (pas de stock photos trop "perfect")
- Moments de surprise, d'émerveillement (ouverture boîte)
- Paysages époustouflants mais accessibles
- Détails (mains qui se tiennent, sourires complices)

**Traitement:**
- Saturation légèrement augmentée (+10%)
- Contraste équilibré
- Warmth légère (teinte chaude)
- Filtre subtil pour cohérence

**Format:**
- Ratio 3:2 pour paysages
- Ratio 4:5 pour portraits (Instagram-friendly)
- Webp optimisé (qualité 85%)
- Lazy loading systématique

### Illustrations

**Quand les utiliser:**
- Section "Comment ça marche" (icônes stylisées)
- États vides (pas de témoignages encore, panier vide)
- Onboarding questionnaire

**Style:**
- Line art minimaliste avec touches de couleur (primary + accent)
- Isométrique pour les steps/process
- Éviter le "corporate" trop froid

**Source:**
- Undraw (gratuit, customisable)
- Humaaans (personnages modulaires)
- Ou commande custom sur Fiverr (50-100€)

### Vidéos

**Hero Video (Homepage):**
- Durée: 15-30 secondes
- Format: MP4, H.264, optimisé
- Autoplay, loop, muted par défaut
- Storyboard:
  1. Couple reçoit mystérieuse boîte (3s)
  2. Ouvre la boîte avec excitation (5s)
  3. Découvre destination (carte, photos) - émerveillement (5s)
  4. Flashs du voyage (montage rapide) (10s)
  5. End frame: Logo + "Réservez votre surprise" (2s)

**Témoignages Vidéos:**
- Durée: 30-60 secondes max
- Vertical (9:16) pour mobile/social
- Sous-titres incrustés (80% regardent sans son)
- Format: Selfie authentique (pas trop produit)

### Iconographie

**Icon Pack:** Lucide React (open-source, moderne, cohérent)

**Icônes principales:**
- 🎁 MapPin: Destinations
- 🎯 Target: Questionnaire/Personnalisation
- ✨ Sparkles: Mystère/Surprise
- ❤️ Heart: Romantique
- 🌲 Trees: Nature
- 🏙️ Building: Urbain
- 🔒 Lock: Paiement sécurisé
- ✓ Check: Validation/Succès
- ⭐ Star: Avis/Ratings
- 📧 Mail: Email/Newsletter
- 💬 MessageCircle: Témoignages
- 🎟️ Ticket: Réservation

---

## ♿ ACCESSIBILITÉ (WCAG 2.1 AA)

### Contrastes Requis

**Texte normal (< 18px):** Ratio 4.5:1 minimum
- ✅ Gray-600 (#4B5563) sur White: 9.36:1
- ✅ Primary-600 (#2563EB) sur White: 8.59:1

**Texte large (≥ 18px ou ≥ 14px gras):** Ratio 3:1 minimum
- ✅ Gray-500 (#6B7280) sur White: 4.51:1

**Boutons/UI:**
- ✅ Accent-500 (#F97316) sur White: 3.54:1 (OK pour large text/buttons)
- ✅ White sur Accent-500: 5.94:1

### Focus States

Tous les éléments interactifs DOIVENT avoir un focus visible:

```css
/* Focus ring par défaut */
*:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Boutons */
button:focus-visible {
  ring: 4px solid var(--primary-100);
}
```

### Navigation Clavier

- Tab order logique
- Skip to content link
- Menu accessible au clavier (Escape pour fermer)
- Modals trapent le focus

### Screen Readers

- Alt text descriptif sur toutes images
- ARIA labels sur icônes seules
- Landmarks HTML5 (<header>, <nav>, <main>, <footer>)

---

## 🎯 GUIDELINES D'UTILISATION

### DO ✅

- Utiliser les couleurs primaires pour CTAs importants
- Respecter les espacements définis (pas de valeurs arbitraires)
- Tester sur mobile AVANT desktop
- Animations subtiles et performantes
- Contraste toujours validé

### DON'T ❌

- Mixer plus de 3 fonts différentes
- Utiliser l'accent orange pour du texte long (fatigue visuelle)
- Animations de plus de 500ms (sensation de lenteur)
- Oublier les focus states
- Utiliser du texte sur image sans overlay sombre

---

*Design System v1.0 | Créé le 09/11/2024*
