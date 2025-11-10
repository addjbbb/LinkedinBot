# 🚀 GUIDE D'INSTALLATION COMPLET

## ✅ Script SQL Créé de Zéro

Un **script SQL unique** a été créé qui fait TOUT :

**Fichier :** `database/00-COMPLETE-SETUP.sql` (650+ lignes)

### Ce qu'il fait :
1. ✅ **Supprime** toutes les tables existantes (nettoyage complet)
2. ✅ **Crée** les 12 tables avec la structure complète
3. ✅ **Configure** toutes les politiques RLS (correctes)
4. ✅ **Crée** tous les index pour la performance
5. ✅ **Configure** les triggers pour auto-update des timestamps
6. ✅ **Insère** 3 destinations d'exemple
7. ✅ **Crée** le compte admin avec hash bcrypt **VALIDE**

## 📋 Les 12 Tables

| # | Table | Description | RLS |
|---|-------|-------------|-----|
| 1 | `users` | Profils utilisateurs (Supabase Auth) | ✅ Users gèrent leur profil |
| 2 | `destinations` | Destinations disponibles | ✅ Public en lecture |
| 3 | `bookings` | Réservations (guest + user) | ✅ Users voient leurs bookings |
| 4 | `questionnaire_responses` | Réponses questionnaire | ✅ Liées aux bookings |
| 5 | `available_dates` | Dates disponibles | ✅ Public en lecture |
| 6 | `payments` | Paiements Stripe | ✅ Users voient leurs paiements |
| 7 | `reviews` | Avis clients | ✅ Avis publiés publics |
| 8 | `booking_options` | Options réservation | ✅ Liées aux bookings |
| 9 | `referrals` | Système parrainage | ✅ Users voient leurs codes |
| 10 | `user_credits` | Crédits utilisateurs | ✅ Users voient leurs crédits |
| 11 | `admins` | Comptes admin | 🔒 BLOQUÉ (Service Role) |
| 12 | `admin_sessions` | Sessions admin | 🔒 BLOQUÉ (Service Role) |

## 🔧 Installation en 3 étapes

### Étape 1 : Exécuter le script SQL

**Dans Supabase Dashboard :**

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Cliquez sur "SQL Editor" dans le menu
4. Cliquez "New query"
5. **Copiez TOUT le contenu** de `database/00-COMPLETE-SETUP.sql`
6. Collez dans l'éditeur
7. Cliquez **"Run"**

**⏱️ Temps : 10 secondes**

**Résultat attendu :**
```
Success. No rows returned
```

### Étape 2 : Vérifier la création

Exécutez cette requête pour vérifier :

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Devrait afficher 12 tables :**
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

### Étape 3 : Tester l'application

#### Test 1 : Inscription utilisateur ✅
```
URL: http://localhost:3000/auth/inscription
1. Remplir le formulaire (prénom, nom, email, password)
2. Accepter CGV
3. Créer le compte
✅ Devrait fonctionner SANS erreur RLS
```

**Avant la correction :**
```
❌ Error: new row violates row-level security policy for table "users"
```

**Après la correction :**
```
✅ Compte créé avec succès !
```

#### Test 2 : Connexion admin ✅
```
URL: http://localhost:3000/admin/login
Email: admin@voyage-mystere.fr
Password: admin123
✅ Devrait se connecter avec succès
```

**Avant la correction :**
```
❌ Error: Email ou mot de passe incorrect
```

**Après la correction :**
```
✅ Connexion réussie → Dashboard admin
```

#### Test 3 : Réservation ✅
```
URL: http://localhost:3000/reserver
1. Choisir un thème (romantique/nature/urbain)
2. Sélectionner des dates
3. Remplir le questionnaire
4. Saisir les informations personnelles
5. Aller au récapitulatif
✅ Devrait créer un booking en base
```

## 🐛 Erreurs Corrigées

### ❌ Erreur 1 : RLS lors de l'inscription
**Erreur :**
```javascript
Error: new row violates row-level security policy for table "users"
```

**Cause :** La politique RLS ne permettait pas aux utilisateurs de créer leur profil lors de l'inscription.

**Correction :** Ajout de la politique INSERT dans `00-COMPLETE-SETUP.sql` :
```sql
CREATE POLICY "Users can insert own profile during signup"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### ❌ Erreur 2 : Login admin impossible
**Erreur :**
```
Admin login error: Error: Email ou mot de passe incorrect
```

**Cause :** Le hash bcrypt dans l'ancien script était invalide (placeholder).

**Correction :** Hash bcrypt **VALIDE** dans `00-COMPLETE-SETUP.sql` :
```sql
password_hash = '$2a$10$GUo6ZUxLg4lG.g6e75m2vew2kBVLI5EQDt2mCkBdYHZA6GkLYKqZu'
-- Hash généré avec: bcrypt.hashSync('admin123', 10)
```

### ❌ Erreur 3 : "policy already exists"
**Erreur :**
```
ERROR: 42710: policy "Admins are not accessible publicly" for table "admins" already exists
```

**Cause :** Les anciens scripts essayaient de créer des policies qui existaient déjà.

**Correction :** Le script `00-COMPLETE-SETUP.sql` fait :
```sql
DROP POLICY IF EXISTS "..." -- Supprime si existe
CREATE POLICY "..." -- Crée la nouvelle
```

## 📁 Structure des fichiers database/

```
database/
├── 00-COMPLETE-SETUP.sql          ⭐ UTILISEZ CELUI-CI
├── README-DATABASE.md              📖 Documentation complète
│
├── fix-users-rls.sql               ⚠️ Inclus dans 00-COMPLETE-SETUP.sql
├── fix-admin-password.sql          ⚠️ Inclus dans 00-COMPLETE-SETUP.sql
├── add-admin-auth-idempotent.sql   ⚠️ Inclus dans 00-COMPLETE-SETUP.sql
│
└── Anciens scripts (obsolètes) :
    ├── RESET-COMPLET.sql           ❌ Ne plus utiliser
    ├── add-admin-auth.sql          ❌ Ne plus utiliser
    └── add-referrals-table.sql     ❌ Ne plus utiliser
```

**⭐ Recommandation :** Utilisez uniquement `00-COMPLETE-SETUP.sql`

## 🔐 Credentials Admin

Après avoir exécuté le script :

```
URL: http://localhost:3000/admin/login
Email: admin@voyage-mystere.fr
Password: admin123
```

**⚠️ IMPORTANT : Changez ce password en production !**

### Changer le password admin :

```sql
-- Générer un nouveau hash:
-- node -e "console.log(require('bcryptjs').hashSync('VOTRE_NOUVEAU_PASSWORD', 10))"

UPDATE admins
SET password_hash = '$2a$10$VOTRE_NOUVEAU_HASH'
WHERE email = 'admin@voyage-mystere.fr';
```

## 📊 Données d'exemple insérées

Le script crée automatiquement :

### 3 Destinations
1. **Château de la Loire** (romantique)
2. **Cabane dans les Alpes** (nature)
3. **Loft parisien** (urbain)

### 1 Admin
- Email: admin@voyage-mystere.fr
- Role: super_admin
- Password: admin123 (hash bcrypt valide)

## 🧪 Commandes de vérification

Après installation, vérifiez tout fonctionne :

### Vérifier les tables
```sql
SELECT COUNT(*) as nb_tables
FROM information_schema.tables
WHERE table_schema = 'public';
-- Devrait retourner: 12
```

### Vérifier les politiques RLS
```sql
SELECT COUNT(*) as nb_policies
FROM pg_policies
WHERE schemaname = 'public';
-- Devrait retourner: ~15-20 policies
```

### Vérifier l'admin
```sql
SELECT email, role, is_active
FROM admins;
-- Devrait retourner: admin@voyage-mystere.fr | super_admin | true
```

### Vérifier les destinations
```sql
SELECT name, theme
FROM destinations;
-- Devrait retourner: 3 destinations
```

### Tester la création d'un booking
```sql
INSERT INTO bookings (theme, start_date, end_date, total_price, email)
VALUES ('romantique', '2024-12-20', '2024-12-22', 890, 'test@test.com')
RETURNING id, booking_number;
-- Devrait créer un booking avec un numéro VM-XXXX-XX-XXXX
```

## 🎯 Workflow Complet

### 1. Setup Base de Données
```
✅ Exécuter 00-COMPLETE-SETUP.sql dans Supabase
✅ Vérifier les 12 tables
✅ Vérifier l'admin existe
```

### 2. Configuration Supabase Auth
```
1. Aller sur Authentication → Settings
2. Activer "Email" provider
3. Ajouter URLs de redirection :
   - http://localhost:3000 (dev)
   - https://votre-domaine.fr (prod)
4. (Optionnel) Désactiver confirmation email pour dev
```

### 3. Variables d'environnement
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... # Pour admin
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Installation dépendances
```bash
npm install
```

### 5. Lancer l'application
```bash
npm run dev
```

### 6. Tester tout
```
✅ Inscription utilisateur → /auth/inscription
✅ Connexion utilisateur → /auth/connexion
✅ Dashboard utilisateur → /mon-compte
✅ Connexion admin → /admin/login
✅ Dashboard admin → /admin
✅ Faire une réservation → /reserver
✅ Système de parrainage → /parrainage
```

## 🚨 Troubleshooting

### Problème : Tables déjà existantes
**Solution :** Le script fait `DROP TABLE IF EXISTS`, donc ça ne devrait pas poser de problème. Relancez le script.

### Problème : Permission denied
**Solution :** Assurez-vous d'utiliser le bon projet Supabase et d'avoir les permissions.

### Problème : RLS errors lors de tests
**Solution :**
1. Vérifiez que le script a bien été exécuté entièrement
2. Vérifiez les policies : `SELECT * FROM pg_policies WHERE schemaname = 'public'`
3. Si nécessaire, ré-exécutez `00-COMPLETE-SETUP.sql`

### Problème : Admin login ne fonctionne toujours pas
**Solution :**
1. Vérifiez que l'admin existe : `SELECT * FROM admins`
2. Vérifiez le hash : devrait commencer par `$2a$10$GUo6ZUxLg4lG`
3. Vérifiez `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`

## 📚 Documentation

- **README-DATABASE.md** - Documentation complète de la base de données
- **ESPACE-CLIENT.md** - Documentation de l'espace client
- **ADMIN-AUTH.md** - Documentation de l'auth admin

## ✅ Checklist finale

Avant de considérer l'installation terminée :

- [ ] Script `00-COMPLETE-SETUP.sql` exécuté avec succès
- [ ] 12 tables créées vérifiées
- [ ] Admin peut se connecter sur `/admin/login`
- [ ] Utilisateur peut s'inscrire sur `/auth/inscription`
- [ ] Utilisateur peut se connecter sur `/auth/connexion`
- [ ] Réservation peut être créée sur `/reserver`
- [ ] Variables d'environnement configurées
- [ ] Application démarre sans erreurs (`npm run dev`)

---

## 🎉 Félicitations !

Si tous les tests passent, votre base de données est **100% opérationnelle** !

**Prochaines étapes :**
1. Configurer Stripe pour les paiements
2. Configurer Resend pour les emails
3. Ajouter plus de destinations
4. Tester le workflow complet de réservation
5. Déployer en production (après avoir changé le password admin !)

---

**Besoin d'aide ?** Consultez `README-DATABASE.md` pour plus de détails.
