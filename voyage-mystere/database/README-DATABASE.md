# 🗄️ BASE DE DONNÉES - Guide Complet

## 📋 Vue d'ensemble

Ce dossier contient **tous les scripts SQL** nécessaires pour configurer la base de données Supabase de Voyage Mystère Premium.

## 🚀 Installation rapide (RECOMMANDÉ)

### Option A: Installation Complète (Recommandée)

Si vous partez de **zéro** ou voulez **tout réinitialiser** :

```sql
-- Fichier: 00-COMPLETE-SETUP.sql
-- ✅ Script unique qui fait TOUT
```

**Ce script va :**
1. ✅ Supprimer toutes les tables existantes (si elles existent)
2. ✅ Créer les 12 tables avec la bonne structure
3. ✅ Configurer toutes les politiques RLS
4. ✅ Créer tous les index pour la performance
5. ✅ Créer les triggers pour updated_at
6. ✅ Insérer 3 destinations d'exemple
7. ✅ Créer le compte admin par défaut

**Exécution :**
1. Allez sur https://app.supabase.com → SQL Editor
2. Copiez **TOUT** le contenu de `00-COMPLETE-SETUP.sql`
3. Cliquez "Run"
4. ✅ Terminé ! Toutes les tables sont créées

**Temps estimé :** 10 secondes

---

## 📊 Tables créées

### 1. **users** - Profils utilisateurs
```sql
id UUID PRIMARY KEY (lié à auth.users)
email VARCHAR(255) UNIQUE
first_name VARCHAR(100)
last_name VARCHAR(100)
phone VARCHAR(20)
created_at, updated_at TIMESTAMP
```

**RLS :**
- ✅ Users peuvent INSERT leur propre profil (signup)
- ✅ Users peuvent SELECT leur propre profil
- ✅ Users peuvent UPDATE leur propre profil

### 2. **destinations** - Destinations disponibles
```sql
id UUID PRIMARY KEY
name VARCHAR(255)
theme VARCHAR(50) ('romantique', 'nature', 'urbain')
region VARCHAR(100)
country VARCHAR(100)
description TEXT
image_url VARCHAR(500)
is_active BOOLEAN
created_at, updated_at TIMESTAMP
```

**RLS :**
- ✅ Tout le monde peut lire les destinations actives

**Données initiales :**
- Château de la Loire (romantique)
- Cabane dans les Alpes (nature)
- Loft parisien (urbain)

### 3. **bookings** - Réservations principales
```sql
id UUID PRIMARY KEY
booking_number VARCHAR(50) UNIQUE
user_id UUID (nullable - pour guest checkout)
theme VARCHAR(20)
start_date, end_date DATE
num_guests INTEGER
total_price DECIMAL(10,2)
status VARCHAR(20) ('draft', 'pending', 'confirmed', 'cancelled', 'completed')

-- Infos client (guest bookings)
email VARCHAR(255)
first_name, last_name VARCHAR(100)
phone VARCHAR(20)
address_line1, address_line2, postal_code, city, country

-- Détails
destination_id UUID
special_requests TEXT
upgrade VARCHAR(50) ('prestige')
selected_options TEXT[] (['champagne', 'photoshoot'])

-- Paiement
payment_status VARCHAR(20)
stripe_payment_intent_id VARCHAR(255)

-- Parrainage
referral_code VARCHAR(50)

created_at, updated_at TIMESTAMP
```

**RLS :**
- ✅ Tout le monde peut créer une réservation (guest checkout)
- ✅ Users peuvent voir leurs réservations (user_id OU email)
- ✅ Users peuvent modifier leurs réservations

**Indexes :**
- user_id, email, status, start_date, booking_number

### 4. **questionnaire_responses** - Réponses questionnaire
```sql
id UUID PRIMARY KEY
booking_id UUID
occasion VARCHAR(100)
traveler_style TEXT[]
rhythm VARCHAR(50)
budget VARCHAR(50)
dietary_restrictions TEXT[]
mobility VARCHAR(100)
phobias TEXT[]
visited_regions TEXT[]
max_distance INTEGER
transport_preference VARCHAR(50)
accommodation_type VARCHAR(100)
preferred_time VARCHAR(50)
desired_experience TEXT
music_preference VARCHAR(100)
created_at TIMESTAMP
```

**RLS :**
- ✅ Tout le monde peut insérer
- ✅ Users peuvent voir leurs réponses

### 5. **available_dates** - Dates disponibles
```sql
id UUID PRIMARY KEY
theme VARCHAR(20)
date DATE
is_available BOOLEAN
max_bookings INTEGER
current_bookings INTEGER
created_at TIMESTAMP
UNIQUE(theme, date)
```

**RLS :**
- ✅ Public en lecture

### 6. **payments** - Paiements
```sql
id UUID PRIMARY KEY
booking_id UUID
amount DECIMAL(10,2)
currency VARCHAR(3)
status VARCHAR(20)
payment_method VARCHAR(50)
stripe_payment_intent_id VARCHAR(255) UNIQUE
stripe_charge_id VARCHAR(255)
error_message TEXT
metadata JSONB
created_at, updated_at TIMESTAMP
```

**RLS :**
- ✅ Users peuvent voir leurs paiements

### 7. **reviews** - Avis clients
```sql
id UUID PRIMARY KEY
booking_id UUID UNIQUE
user_id UUID
rating INTEGER (1-5)
title VARCHAR(255)
comment TEXT
is_published BOOLEAN
admin_response TEXT
created_at, updated_at TIMESTAMP
```

**RLS :**
- ✅ Avis publiés visibles par tous
- ✅ Users peuvent créer des avis pour leurs réservations
- ✅ Users peuvent voir leurs propres avis

### 8. **booking_options** - Options de réservation
```sql
id UUID PRIMARY KEY
booking_id UUID
option_id VARCHAR(50)
option_name VARCHAR(100)
price DECIMAL(10,2)
created_at TIMESTAMP
```

**RLS :**
- ✅ Users peuvent voir leurs options

### 9. **referrals** - Système de parrainage
```sql
id UUID PRIMARY KEY
user_id UUID (le parrain)
referral_code VARCHAR(50) UNIQUE
referred_user_id UUID (le filleul)
referred_booking_id UUID
status VARCHAR(20) ('pending', 'completed', 'cancelled')
reward_amount DECIMAL(10,2) DEFAULT 50
created_at TIMESTAMP
completed_at TIMESTAMP
```

**RLS :**
- ✅ Users peuvent voir leurs parrainages
- ✅ Users peuvent créer leur code

### 10. **user_credits** - Crédits utilisateurs
```sql
id UUID PRIMARY KEY
user_id UUID
amount DECIMAL(10,2)
source VARCHAR(50) ('referral', 'promo', 'compensation')
source_id UUID
is_used BOOLEAN
used_on_booking_id UUID
expires_at TIMESTAMP
created_at, used_at TIMESTAMP
```

**RLS :**
- ✅ Users peuvent voir leurs crédits

### 11. **admins** - Comptes administrateurs
```sql
id UUID PRIMARY KEY
email VARCHAR(255) UNIQUE
password_hash VARCHAR(255) (bcrypt)
first_name, last_name VARCHAR(100)
role VARCHAR(50) ('admin', 'super_admin')
is_active BOOLEAN
last_login TIMESTAMP
created_at, updated_at TIMESTAMP
```

**RLS :**
- 🔒 BLOQUÉ - Accessible uniquement via Service Role Key

**Admin par défaut :**
- Email: admin@voyage-mystere.fr
- Password: admin123 (hash bcrypt)

### 12. **admin_sessions** - Sessions admin
```sql
id UUID PRIMARY KEY
admin_id UUID
token VARCHAR(500) UNIQUE
expires_at TIMESTAMP (8h)
created_at TIMESTAMP
```

**RLS :**
- 🔒 BLOQUÉ - Accessible uniquement via Service Role Key

---

## 🔧 Scripts utilitaires

### Option B: Scripts individuels (si vous voulez plus de contrôle)

Si vous avez déjà des tables et voulez juste corriger des problèmes spécifiques :

| Script | Usage | Quand l'utiliser |
|--------|-------|-----------------|
| `fix-users-rls.sql` | Corrige RLS pour signup utilisateur | ❌ Erreur: "new row violates row-level security" |
| `fix-admin-password.sql` | Met à jour le password admin | ❌ Erreur: "Email ou mot de passe incorrect" admin |
| `add-admin-auth-idempotent.sql` | Ajoute/met à jour auth admin | Veut réinstaller système admin |

### Scripts obsolètes (ne pas utiliser)

Ces scripts sont conservés pour référence mais **ne sont plus nécessaires** :

- ~~`RESET-COMPLET.sql`~~ → Remplacé par `00-COMPLETE-SETUP.sql`
- ~~`add-admin-auth.sql`~~ → Remplacé par `00-COMPLETE-SETUP.sql`
- ~~`add-referrals-table.sql`~~ → Inclus dans `00-COMPLETE-SETUP.sql`

---

## ✅ Vérification post-installation

Après avoir exécuté `00-COMPLETE-SETUP.sql`, vérifiez que tout fonctionne :

### 1. Vérifier les tables
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Devrait afficher :**
- admins
- admin_sessions
- available_dates
- booking_options
- bookings
- destinations
- payments
- questionnaire_responses
- referrals
- reviews
- user_credits
- users

### 2. Vérifier les politiques RLS
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Devrait afficher ~15-20 policies**

### 3. Tester l'admin
```sql
SELECT email, role, is_active
FROM admins;
```

**Devrait afficher :**
- admin@voyage-mystere.fr | super_admin | true

### 4. Vérifier les destinations
```sql
SELECT name, theme, region
FROM destinations;
```

**Devrait afficher 3 destinations**

---

## 🧪 Test de l'application

### 1. Test Inscription Utilisateur
```
URL: http://localhost:3000/auth/inscription
1. Remplir le formulaire
2. Créer le compte
✅ Devrait fonctionner sans erreur RLS
```

### 2. Test Connexion Admin
```
URL: http://localhost:3000/admin/login
Email: admin@voyage-mystere.fr
Password: admin123
✅ Devrait se connecter avec succès
```

### 3. Test Réservation
```
URL: http://localhost:3000/reserver
1. Choisir thème
2. Sélectionner dates
3. Remplir questionnaire
4. Saisir informations
✅ Devrait créer un booking en base
```

---

## 🔐 Sécurité

### Politiques RLS configurées

Toutes les tables ont RLS activé avec les bonnes politiques :

✅ **users** - Users peuvent gérer leur propre profil
✅ **bookings** - Accès par user_id OU email
✅ **destinations** - Public en lecture
✅ **questionnaire_responses** - Lié aux bookings de l'user
✅ **payments** - Uniquement ses propres paiements
✅ **reviews** - Avis publiés publics, autres privés
✅ **referrals** - Uniquement ses parrainages
✅ **user_credits** - Uniquement ses crédits
✅ **admins** - BLOQUÉ (Service Role uniquement)
✅ **admin_sessions** - BLOQUÉ (Service Role uniquement)

### Variables d'environnement requises

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Pour admin

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (emails)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_URL=http://localhost:3000
```

---

## 🚨 Troubleshooting

### Erreur: "relation already exists"
**Solution :** Le script DROP les tables avant de les créer. Si vous avez encore cette erreur, c'est que vous utilisez un ancien script. Utilisez `00-COMPLETE-SETUP.sql`.

### Erreur: "policy already exists"
**Solution :** Le script DROP les policies avant de les créer. Utilisez `00-COMPLETE-SETUP.sql`.

### Erreur: "new row violates row-level security"
**Solution :** Les politiques RLS sont correctement configurées dans `00-COMPLETE-SETUP.sql`. Si vous avez cette erreur, ré-exécutez le script complet.

### Erreur: "Email ou mot de passe incorrect" (admin)
**Solution :** Le hash bcrypt est correct dans `00-COMPLETE-SETUP.sql`. Assurez-vous que :
1. Le script a bien été exécuté
2. Vous utilisez : admin@voyage-mystere.fr / admin123

### Erreur: "Cannot read property of undefined" (TypeScript)
**Solution :** Assurez-vous que toutes les tables existent. Exécutez `00-COMPLETE-SETUP.sql`.

---

## 📝 Changelog

### Version 1.0 (00-COMPLETE-SETUP.sql)
- ✅ Script unique pour tout créer
- ✅ 12 tables avec structure complète
- ✅ Toutes les politiques RLS
- ✅ Tous les index
- ✅ Triggers updated_at
- ✅ Données d'exemple
- ✅ Admin par défaut avec hash bcrypt valide

---

## ⚠️ IMPORTANT PRODUCTION

Avant de déployer en production :

1. **Changer le password admin**
```sql
UPDATE admins
SET password_hash = '$2a$10$YOUR_NEW_HASH'
WHERE email = 'admin@voyage-mystere.fr';
```

2. **Configurer Supabase Auth**
- Activer Email Auth
- Configurer les templates d'emails
- Ajouter les URLs de redirection

3. **Configurer Stripe**
- Webhooks pour paiements
- Clés de production

4. **Monitoring**
- Activer les logs Supabase
- Configurer Sentry pour erreurs
- Mettre en place alertes

---

**✅ Vous êtes maintenant prêt à utiliser l'application !**
