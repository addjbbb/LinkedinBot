# 🔐 Accès Admin & Suivi Parrainage

## 🎯 Accès Dashboard Admin

### URL d'accès
```
http://localhost:3000/admin
```
En production :
```
https://votre-domaine.com/admin
```

### Statut actuel
⚠️ **Pas de protection d'accès pour le moment** - Tout le monde peut accéder à `/admin`

### 🔒 TODO : Ajouter une authentification

**Option 1 : Protection simple avec mot de passe**
```tsx
// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Vérifier si déjà connecté
    const adminAuth = localStorage.getItem('admin_authenticated')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mot de passe simple (à changer !)
    if (password === 'VotreMotDePasseAdmin2024') {
      localStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Mot de passe incorrect')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">Connexion Admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin"
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-2 rounded"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Votre code admin actuel...
  return (
    // Dashboard admin
  )
}
```

**Option 2 : Authentification avec Supabase** (Recommandé)
```tsx
// Utiliser Supabase Auth avec un rôle "admin"
// Voir lib/supabase.ts pour l'implémentation
```

---

## 🎁 Suivi du Parrainage

### URL de la page
```
http://localhost:3000/parrainage
```

### Statut actuel
⚠️ **Données en mode "mock"** - Les statistiques sont hardcodées

Les stats affichées actuellement :
```tsx
// Mock data dans app/parrainage/page.tsx
const referralCode = 'JEAN2024'
const stats = {
  friendsReferred: 0,
  creditsEarned: 0,
  pending: 0,
}
```

### 📊 TODO : Connecter au vrai système

**Étape 1 : Créer table dans Supabase**
```sql
-- Table pour les parrainages
CREATE TABLE referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID REFERENCES users(id),
  referee_email VARCHAR(255) NOT NULL,
  referee_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, credited
  credit_amount DECIMAL(10,2) DEFAULT 50.00,
  booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Index pour performance
CREATE INDEX idx_referrer ON referrals(referrer_id);
CREATE INDEX idx_referee_email ON referrals(referee_email);
```

**Étape 2 : Créer API Route**
```tsx
// app/api/referrals/stats/route.ts
import { createClient } from '@/lib/supabase'

export async function GET(request: Request) {
  const supabase = createClient()

  // Récupérer l'utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Stats du parrainage
  const { data: referrals, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', user.id)

  const friendsReferred = referrals?.filter(r => r.status === 'completed').length || 0
  const creditsEarned = referrals?.filter(r => r.status === 'credited')
    .reduce((sum, r) => sum + r.credit_amount, 0) || 0
  const pending = referrals?.filter(r => r.status === 'pending').length || 0

  return Response.json({
    friendsReferred,
    creditsEarned,
    pending,
    referrals,
  })
}
```

**Étape 3 : Modifier la page parrainage**
```tsx
// app/parrainage/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function ParrainagePage() {
  const [stats, setStats] = useState({
    friendsReferred: 0,
    creditsEarned: 0,
    pending: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch('/api/referrals/stats')
      const data = await res.json()
      setStats(data)
      setLoading(false)
    }
    fetchStats()
  }, [])

  // Reste du code...
}
```

**Étape 4 : Logique d'attribution des crédits**
```tsx
// app/api/webhooks/stripe/route.ts
// Quand un paiement est confirmé, vérifier si c'est un filleul

export async function POST(request: Request) {
  const event = await stripe.webhooks.constructEvent(...)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    // Récupérer le code de parrainage depuis les metadata
    const referralCode = session.metadata?.referral_code

    if (referralCode) {
      // 1. Créer ou mettre à jour le referral
      // 2. Appliquer 50€ de réduction au filleul
      // 3. Créditer 50€ au parrain

      const supabase = createClient()

      // Trouver le parrain via son code
      const { data: referrer } = await supabase
        .from('users')
        .select('*')
        .eq('referral_code', referralCode)
        .single()

      if (referrer) {
        // Marquer le referral comme completed
        await supabase
          .from('referrals')
          .update({
            status: 'completed',
            completed_at: new Date(),
            booking_id: booking.id,
          })
          .eq('referrer_id', referrer.id)
          .eq('referee_email', session.customer_email)

        // Créditer le parrain
        await supabase
          .from('user_credits')
          .insert({
            user_id: referrer.id,
            amount: 50,
            source: 'referral',
            description: `Parrainage de ${session.customer_email}`,
          })
      }
    }
  }
}
```

---

## 🔧 Dashboard Admin - Fonctionnalités

### Actuellement disponible
✅ Vue d'ensemble avec 4 KPIs :
- Total réservations
- Réservations en attente
- Chiffre d'affaires
- Note moyenne

✅ Tableau des réservations :
- Recherche par nom/email/numéro
- Filtres par statut, thème
- Actions rapides (Voir, Email)

### En mode "mock" (à connecter)
⚠️ Les données sont hardcodées dans le code
⚠️ Pas de vraie connexion à la base de données

### Pour connecter au vrai système

**1. Créer API Route pour les stats**
```tsx
// app/api/admin/stats/route.ts
export async function GET() {
  const supabase = createClient()

  // Total bookings
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  // Pending bookings
  const { count: pendingBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Revenue
  const { data: bookings } = await supabase
    .from('bookings')
    .select('price')
    .eq('payment_status', 'paid')

  const revenue = bookings?.reduce((sum, b) => sum + b.price, 0) || 0

  return Response.json({
    totalBookings,
    pendingBookings,
    revenue,
    avgRating: 4.8, // TODO: calculer depuis reviews
  })
}
```

**2. Fetch dans la page admin**
```tsx
// app/admin/page.tsx
useEffect(() => {
  async function fetchStats() {
    const res = await fetch('/api/admin/stats')
    const data = await res.json()
    setStats(data)
  }
  fetchStats()
}, [])
```

---

## 📝 Checklist de sécurisation

### Avant mise en production

- [ ] Ajouter authentification admin (mot de passe ou Supabase Auth)
- [ ] Créer rôle "admin" dans Supabase
- [ ] Middleware Next.js pour protéger `/admin/*`
- [ ] Variables d'environnement pour mot de passe admin
- [ ] Logs d'accès admin (qui accède quand)
- [ ] Rate limiting sur `/api/admin/*`
- [ ] HTTPS obligatoire en production
- [ ] Session timeout (déconnexion auto après 30min)

---

## 🚀 Accès rapides

**Dashboard Admin:**
- URL : `/admin`
- Statut : ⚠️ Non protégé actuellement

**Programme Parrainage:**
- URL : `/parrainage`
- Statut : ⚠️ Données mock

**Espace Client:**
- URL : `/espace-client`
- Statut : ⚠️ Non protégé actuellement

---

**Note:** Toutes les pages fonctionnent visuellement mais nécessitent une connexion à Supabase pour afficher les vraies données et ajouter l'authentification.
