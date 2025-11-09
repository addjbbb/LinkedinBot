# 🔐 AUTHENTIFICATION ADMIN - Documentation

## 📋 Vue d'ensemble

Un système d'authentification sécurisé a été créé pour protéger l'accès au dashboard admin avec:
- Authentification par email/mot de passe
- Sessions sécurisées avec tokens
- Protection par middleware
- Gestion des rôles (admin, super_admin)
- Interface de connexion dédiée

## 🗄️ Base de données

### Tables créées

#### 1. Table `admins`
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,  -- Hashé avec bcrypt
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin',      -- 'admin' ou 'super_admin'
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Table `admin_sessions`
```sql
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,    -- UUID v4
  expires_at TIMESTAMP NOT NULL,         -- Expiration après 8h
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

Les deux tables ont RLS activé avec politique **bloquée par défaut**:
- Aucun accès via client Supabase normal
- Accessible uniquement via Service Role Key (côté serveur)
- Garantit que les admins ne sont pas exposés publiquement

### Script SQL

**Fichier:** `database/add-admin-auth.sql`

**Exécution:**
```bash
1. Allez sur https://app.supabase.com → SQL Editor
2. Copiez le contenu de database/add-admin-auth.sql
3. Exécutez le script
4. Vérifiez le message de confirmation
```

**Le script créé automatiquement:**
- Les 2 tables avec index
- Les politiques RLS
- Un admin par défaut (email: admin@voyage-mystere.fr, password: admin123)

## 🔑 Système d'authentification

### Architecture

```
┌─────────────────┐
│  Admin Login    │ → POST /api/admin/auth/login
│  /admin/login   │    (email + password)
└────────┬────────┘
         │
         ▼
    ┌────────────────────────────┐
    │  lib/admin-auth.ts         │
    │  - Vérification password   │
    │  - Création session/token  │
    │  - Hash bcrypt (10 rounds) │
    └────────────────────────────┘
         │
         ▼
    ┌────────────────┐
    │  Cookie        │  admin_token (8h expiration)
    │  js-cookie     │
    └────────────────┘
         │
         ▼
    ┌─────────────────────────────┐
    │  Admin Dashboard            │
    │  /admin (protégé)           │
    │  - Vérification token       │
    │  - useAdminAuth hook        │
    │  - Données temps réel       │
    └─────────────────────────────┘
```

### Fichiers clés

#### 1. **`lib/admin-auth.ts`** - Fonctions serveur
```typescript
// Connexion admin
adminSignIn(email, password)
  → Vérifie email + password avec bcrypt
  → Génère token UUID v4
  → Crée session (expires 8h)
  → Retourne { token, admin, expiresAt }

// Déconnexion
adminSignOut(token)
  → Supprime session de la DB

// Vérification session
verifyAdminSession(token)
  → Vérifie token existe et non expiré
  → Retourne admin ou null

// Création admin (super_admin only)
createAdmin({ email, password, firstName, lastName, role })
  → Hash password avec bcrypt
  → Insère dans table admins

// Changement mot de passe
changeAdminPassword(adminId, newPassword)
  → Hash nouveau password
  → Met à jour dans DB
```

**Note:** Utilise `SUPABASE_SERVICE_ROLE_KEY` pour bypasser RLS

#### 2. **`hooks/useAdminAuth.tsx`** - Context React
```typescript
const { admin, loading, signOut } = useAdminAuth()

// admin: { id, email, firstName, lastName, role, isActive }
// loading: boolean - état de chargement initial
// signOut: () => void - fonction de déconnexion
```

**Fonctionnement:**
- Vérifie le cookie `admin_token` au chargement
- Appelle `/api/admin/verify` pour vérifier la session
- Met à jour l'état admin
- Fournit la fonction signOut

#### 3. **`middleware.ts`** - Protection des routes
```typescript
// Intercepte toutes les requêtes /admin/*
// Exceptions: /admin/login (page publique)
// Si pas de token cookie → Redirect /admin/login
```

**Config:**
```typescript
export const config = {
  matcher: ['/admin/:path*'], // Protège /admin et sous-routes
}
```

### APIs créées

#### POST `/api/admin/auth/login`
**Body:**
```json
{
  "email": "admin@voyage-mystere.fr",
  "password": "admin123"
}
```

**Response (success):**
```json
{
  "success": true,
  "token": "uuid-v4-token",
  "admin": {
    "id": "...",
    "email": "admin@voyage-mystere.fr",
    "firstName": "Admin",
    "lastName": "Voyage Mystère",
    "role": "super_admin",
    "isActive": true
  },
  "expiresAt": "2024-01-10T18:00:00Z"
}
```

**Response (error 401):**
```json
{
  "error": "Email ou mot de passe incorrect"
}
```

#### POST `/api/admin/auth/logout`
**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true
}
```

#### GET `/api/admin/verify`
**Headers:**
```
Authorization: Bearer {token}
```

**Response (success):**
```json
{
  "admin": {
    "id": "...",
    "email": "admin@voyage-mystere.fr",
    "firstName": "Admin",
    "lastName": "Voyage Mystère",
    "role": "super_admin",
    "isActive": true
  }
}
```

**Response (error 401):**
```json
{
  "error": "Session invalide ou expirée"
}
```

## 🎨 Interface utilisateur

### Page de connexion (`/admin/login`)

**Design:**
- Fond sombre (gradient gray-900 → gray-800)
- Card centrée avec ombre
- Icône Shield en gradient
- Formulaire épuré
- Messages de sécurité

**Fonctionnalités:**
- Validation email format
- Validation mot de passe requis
- Messages d'erreur clairs
- Loading state pendant connexion
- Toast notifications

### Dashboard Admin (`/admin`)

**Protections:**
- ✅ Middleware redirect si pas de token
- ✅ Hook useAdminAuth vérifie session
- ✅ Loading screen pendant vérification
- ✅ Redirect /admin/login si invalide

**Header mis à jour:**
- Nom et email de l'admin connecté
- Bouton de déconnexion avec icône LogOut
- Responsive (nom caché sur mobile)

**Données en temps réel:**
- Stats récupérées via `/api/admin/stats`
- Authentification par token dans headers
- Loading states pendant fetch

## 🔒 Sécurité

### Mesures implémentées

1. **Hash des mots de passe**
   - bcrypt avec 10 rounds
   - Jamais stocké en clair
   - Salt automatique

2. **Sessions avec expiration**
   - Tokens UUID v4 (impossibles à deviner)
   - Expiration 8 heures
   - Nettoyage automatique possible

3. **RLS strict**
   - Tables admins inaccessibles publiquement
   - Service Role Key côté serveur uniquement
   - Jamais exposé côté client

4. **Middleware de protection**
   - Bloque accès /admin sans token
   - Vérification côté serveur
   - Redirect automatique

5. **Cookies sécurisés**
   - Expiration 8 heures
   - Stockage js-cookie
   - Supprimés à la déconnexion

6. **Validation stricte**
   - Email format vérifié
   - Mot de passe obligatoire
   - is_active vérifié

### Vulnérabilités potentielles à surveiller

⚠️ **À améliorer en production:**
- [ ] Cookies avec `httpOnly: true, secure: true, sameSite: 'strict'`
- [ ] Rate limiting sur /api/admin/auth/login (prévenir brute force)
- [ ] 2FA (double authentification)
- [ ] Logs d'authentification
- [ ] Détection tentatives suspectes
- [ ] Renouvellement automatique token
- [ ] IP whitelisting (optionnel)

## 📝 Utilisation

### 1. Installation

```bash
# Installer les nouvelles dépendances
npm install bcryptjs js-cookie uuid
npm install --save-dev @types/bcryptjs @types/js-cookie @types/uuid
```

### 2. Configuration Supabase

```bash
# 1. Exécuter le script SQL
# database/add-admin-auth.sql dans Supabase SQL Editor

# 2. Vérifier les variables d'environnement
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

### 3. Tester la connexion

```bash
# Credentials par défaut:
Email: admin@voyage-mystere.fr
Password: admin123

# ⚠️ CHANGER EN PRODUCTION !
```

**Étapes:**
1. Aller sur `http://localhost:3000/admin/login`
2. Saisir email + password
3. Cliquer "Connexion sécurisée"
4. Redirection vers `/admin` (dashboard)

### 4. Créer un nouvel admin

**Option 1: Via SQL** (recommandé pour premier admin)
```sql
-- Générer hash du password avec bcrypt online (10 rounds)
-- Ou utiliser: node -e "console.log(require('bcryptjs').hashSync('monpassword', 10))"

INSERT INTO admins (email, password_hash, first_name, last_name, role)
VALUES (
  'nouveau@voyage-mystere.fr',
  '$2a$10$...hash...', -- Hash généré
  'Prénom',
  'Nom',
  'admin'
);
```

**Option 2: Via API** (si super_admin connecté)
```typescript
import { createAdmin } from '@/lib/admin-auth'

await createAdmin({
  email: 'nouveau@voyage-mystere.fr',
  password: 'motdepasse',
  firstName: 'Prénom',
  lastName: 'Nom',
  role: 'admin' // ou 'super_admin'
})
```

### 5. Changer mot de passe

```typescript
import { changeAdminPassword } from '@/lib/admin-auth'

await changeAdminPassword(adminId, 'nouveauMotDePasse')
```

## 🚦 Workflow complet

```
1. Admin visite /admin
   ↓
2. Middleware vérifie cookie admin_token
   ↓ non
3. Redirect → /admin/login
   ↓
4. Saisit email + password
   ↓
5. POST /api/admin/auth/login
   ↓
6. Vérification bcrypt
   ↓ valide
7. Création session + token
   ↓
8. Cookie admin_token set (8h)
   ↓
9. Redirect → /admin
   ↓
10. useAdminAuth vérifie token via /api/admin/verify
   ↓ valide
11. Dashboard affiché avec données admin
   ↓
12. Fetch stats avec token dans headers
   ↓
13. Admin clique "Déconnexion"
   ↓
14. POST /api/admin/auth/logout
   ↓
15. Session supprimée + Cookie supprimé
   ↓
16. Redirect → /admin/login
```

## 📊 Différences Admin vs User

| Aspect | User (Client) | Admin |
|--------|--------------|-------|
| Authentification | Supabase Auth (JWT) | Custom (bcrypt + sessions) |
| Table | `users` (public RLS) | `admins` (RLS bloqué) |
| Sessions | Supabase gestion auto | Table custom `admin_sessions` |
| Cookies | Supabase cookies | `admin_token` cookie |
| Hook | `useAuth()` | `useAdminAuth()` |
| Routes | `/mon-compte/*` | `/admin/*` |
| APIs | `/api/user/*` | `/api/admin/*` |
| Layout | `AuthProvider` | `AdminAuthProvider` |
| Middleware | Non | Oui (`/admin/*`) |

## 🎉 Résumé

✅ **Créé:**
- Table `admins` avec RLS bloqué
- Table `admin_sessions` pour tokens
- Système auth complet (login, logout, verify)
- Hook `useAdminAuth` pour React
- Middleware protection `/admin/*`
- Page login admin stylisée
- Dashboard mis à jour avec auth
- Admin par défaut créé

✅ **Sécurisé:**
- Passwords hashés bcrypt
- Sessions avec expiration
- RLS strict (service role only)
- Middleware de protection
- Validation stricte
- Tokens uniques UUID

✅ **Prêt pour:**
- Production (après changement password par défaut)
- Ajout de nouveaux admins
- Gestion des rôles
- Monitoring des sessions

---

**⚠️ IMPORTANT PRODUCTION:**

Avant de déployer en production, **IMPÉRATIVEMENT:**
1. Changer le password par défaut de `admin@voyage-mystere.fr`
2. Désactiver ou supprimer le compte par défaut
3. Créer vos propres comptes admin sécurisés
4. Activer cookies httpOnly + secure
5. Ajouter rate limiting sur login
6. Monitorer les tentatives de connexion
7. Considérer 2FA pour super_admins

**Le système est fonctionnel mais le password par défaut est un risque de sécurité majeur !**
