# 🚀 Installation - Voyage Mystère Premium

Guide d'installation complet et définitif. Un seul script SQL, une procédure claire.

---

## ✅ Corrections Effectuées

- ❌ **11 fichiers SQL supprimés** (confusion terminée)
- ✅ **1 seul script propre** : `database/SETUP-FINAL.sql`
- ✅ **Toutes les APIs corrigées** avec les bons noms de colonnes
- ✅ **Dashboard admin utilise de vraies données**
- ✅ **Système de parrainage corrigé**
- ✅ **Plus de mock data**

---

## 📋 Installation en 3 Étapes

### Étape 1 : Nettoyer les Utilisateurs (Optionnel)

Si vous voulez repartir de zéro :

1. **Supabase Dashboard** → **Authentication** → **Users**
2. Supprimez tous les utilisateurs un par un
3. Retournez à l'étape 2

**Si vous sautez cette étape**, les utilisateurs existants seront automatiquement synchronisés.

---

### Étape 2 : Exécuter LE Script SQL

1. **Supabase Dashboard** → **SQL Editor**
2. Copiez **tout** le contenu de `database/SETUP-FINAL.sql`
3. Collez dans l'éditeur
4. Cliquez sur **Run**
5. Attendez 10 secondes

**✅ Ce script fait TOUT :**
- Supprime les anciennes tables
- Crée les 12 tables avec le bon schéma
- Configure tous les index
- Active toutes les politiques RLS
- Crée le trigger auto-profil
- Insère 3 destinations
- Insère 1 admin (admin@voyage-mystere.fr / admin123)
- Synchronise les utilisateurs existants

**Résultat attendu** : "Query executed successfully"

---

### Étape 3 : Tester

#### Test 1 : Inscription
1. Allez sur `/auth/inscription`
2. Créez un compte
3. **Résultat** : Compte créé, profil dans `public.users` ✅

#### Test 2 : Connexion
1. Connectez-vous avec le compte créé
2. **Résultat** : Redirection vers Mon Compte ✅

#### Test 3 : Admin
1. Allez sur `/admin/login`
2. Email : `admin@voyage-mystere.fr`
3. Mot de passe : `admin123`
4. **Résultat** : Accès au dashboard ✅

#### Test 4 : Destinations
1. Dans l'admin, cliquez sur "Destinations"
2. **Résultat** : 3 destinations affichées ✅

#### Test 5 : Clients
1. Dans l'admin, cliquez sur "Clients"
2. **Résultat** : Liste des utilisateurs avec stats ✅

---

## 🗂️ Structure de la Base

### 12 Tables

| Table | Description |
|-------|-------------|
| `users` | Profils utilisateurs (lié à auth.users) + **my_referral_code** |
| `destinations` | Destinations disponibles |
| `bookings` | Réservations |
| `questionnaire_responses` | Réponses questionnaires |
| `available_dates` | Dates disponibles |
| `payments` | Paiements |
| `reviews` | Avis clients |
| `booking_options` | Options de réservation |
| `referrals` | Parrainages effectifs |
| `user_credits` | Crédits utilisateurs |
| `admins` | Comptes administrateurs |
| `admin_sessions` | Sessions admin |

### Colonnes Importantes

**users :**
- `my_referral_code` : Code personnel de parrainage (unique)

**bookings :**
- `booking_number` : Numéro de réservation (ex: VM-2024-11-0001)
- `first_name`, `last_name` : Nom du client
- `payment_status` : 'pending' | 'paid'

**referrals :**
- `referrer_id` : Celui qui parraine
- `referee_id` : Celui qui est parrainé
- `referee_email` : Email du parrainé (NOT NULL)

---

## 🔧 APIs Corrigées

### `/api/referral/stats`
✅ Utilise `referrer_id` au lieu de `user_id`

### `/api/user/referral-code`
✅ Stocke le code dans `users.my_referral_code`

### `/api/admin/bookings`
✅ Récupère toutes les réservations réelles

### `/api/admin/customers`
✅ Liste tous les clients avec statistiques

### `/api/admin/destinations`
✅ Toutes les destinations

---

## 📊 Vérification Post-Installation

### Dans Supabase

#### 1. Table Editor → users
- Vérifiez que `my_referral_code` existe ✅
- Vérifiez que les profils correspondent à auth.users ✅

#### 2. Table Editor → bookings
- Vide au début (normal) ✅
- Se remplit quand un utilisateur réserve ✅

#### 3. Table Editor → destinations
- 3 destinations présentes ✅

#### 4. Table Editor → admins
- 1 admin présent ✅

#### 5. Database → Advisor
- Aucune erreur RLS ✅

---

## 🐛 Problèmes Connus Résolus

### ❌ Avant
- 12 fichiers SQL différents
- Mock data dans l'admin
- `user_id` au lieu de `referrer_id`
- Code de parrainage stocké dans `referrals` (incorrect)
- Colonnes `customer`, `price`, `startDate` (incorrectes)

### ✅ Après
- 1 seul fichier SQL propre
- Vraies données de la base
- `referrer_id` correct
- Code stocké dans `users.my_referral_code`
- Colonnes `first_name`, `total_price`, `start_date` (correctes)

---

## 🎯 Prochaines Étapes

1. ✅ **Testez une inscription complète**
2. ✅ **Testez une réservation**
3. ✅ **Vérifiez l'admin**
4. ✅ **Configurez Stripe en production**
5. ✅ **Déployez sur Vercel**

---

## 📞 Support

Si vous rencontrez un problème :

1. **Vérifiez les logs Supabase** (Logs Explorer)
2. **Vérifiez la console navigateur** (F12)
3. **Exécutez cette requête** :

```sql
-- Vérifier la structure
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Devrait afficher my_referral_code ✅
```

---

## ✅ Checklist Finale

Installation complète :
- [ ] Script SQL exécuté sans erreur
- [ ] Destinations visibles (3)
- [ ] Admin créé (login fonctionne)
- [ ] Inscription fonctionne
- [ ] Profil créé dans `public.users`
- [ ] Dashboard admin affiche vraies données
- [ ] Section Clients fonctionne
- [ ] Section Destinations fonctionne
- [ ] Section Réservations fonctionne
- [ ] Aucune erreur RLS

**Si toutes les cases sont cochées : Vous êtes prêt pour la production ! 🚀**

---

*Dernière mise à jour : 10 novembre 2024*
*Version : 3.0.0 - Clean & Production Ready*
