# 👤 ESPACE CLIENT - Documentation Complète

## 📋 Vue d'ensemble

L'espace client permet aux utilisateurs de :
- Créer un compte et se connecter
- Voir toutes leurs réservations
- Gérer leur profil
- Accéder au système de parrainage
- Suivre leurs crédits et récompenses

## 🔐 Système d'Authentification

### Technologies utilisées
- **Supabase Auth** - Authentification sécurisée
- **React Context** - Gestion de l'état d'authentification
- **Protected Routes** - Routes protégées par authentification

### Pages d'authentification

#### 1. **Connexion** (`/auth/connexion`)
- Email + mot de passe
- Validation côté client
- Messages d'erreur clairs
- Lien vers inscription et mot de passe oublié

#### 2. **Inscription** (`/auth/inscription`)
- Prénom, nom, email, mot de passe
- Validation:
  - Email valide
  - Mot de passe ≥ 8 caractères
  - Confirmation de mot de passe
  - Acceptation des CGV obligatoire
- Création automatique du profil utilisateur dans la table `users`

#### 3. **Mot de passe oublié** (`/auth/mot-de-passe-oublie`)
- Envoi d'email de réinitialisation via Supabase
- Page de confirmation après envoi

### Fichiers clés

**`lib/auth.ts`** - Fonctions d'authentification:
```typescript
- signUp(email, password, firstName, lastName)
- signIn(email, password)
- signOut()
- getCurrentUser()
- resetPassword(email)
- updatePassword(newPassword)
- updateProfile(userId, data)
```

**`hooks/useAuth.tsx`** - Hook React pour l'auth:
```typescript
const { user, loading, signOut } = useAuth()
```

## 👨‍💼 Pages de l'espace client

### 1. **Dashboard** (`/mon-compte`)

**Fonctionnalités:**
- Statistiques rapides:
  - Nombre de voyages réalisés (confirmed + completed)
  - Réservations en cours (pending + confirmed)
  - Crédits disponibles
- Liste complète des réservations avec:
  - Statut (brouillon, en attente, confirmé, annulé, terminé)
  - Thème (romantique, nature, urbain)
  - Dates de voyage
  - Nombre de voyageurs
  - Prix total
  - Statut de paiement
  - Demandes spéciales
- Sidebar de navigation

**API utilisée:**
```
GET /api/user/bookings?userId={userId}&email={email}
```

**Badges de statut:**
- 🕐 **Brouillon** (gris) - Réservation incomplète
- 🕐 **En attente** (jaune) - En attente de paiement
- ✅ **Confirmé** (vert) - Réservation confirmée et payée
- ❌ **Annulé** (rouge) - Réservation annulée
- ✅ **Terminé** (bleu) - Voyage effectué

### 2. **Profil utilisateur** (`/mon-compte/profil`)

**Informations modifiables:**
- Prénom
- Nom
- Téléphone

**Informations en lecture seule:**
- Email (ne peut pas être modifié)

**Section sécurité:**
- Modifier le mot de passe
- Supprimer le compte

**API utilisée:**
```typescript
updateProfile(userId, {
  firstName,
  lastName,
  phone
})
```

### 3. **Parrainage** (`/parrainage`)

**Fonctionnalités:**
- Génération automatique d'un code unique:
  - Format: `{Initiales}{4 chiffres aléatoires}`
  - Exemple: `JD1234` pour Jean Dupont
- Lien de parrainage personnalisé
- Partage via:
  - 📧 Email (pré-rempli avec message)
  - 💬 WhatsApp
  - 📘 Facebook
  - 🐦 Twitter
- Copie en un clic du code et du lien
- Statistiques en temps réel:
  - Amis parrainés (complétés)
  - Crédits gagnés
  - Parrainages en attente

**APIs utilisées:**
```
POST /api/user/referral-code
  → Génère ou récupère le code de parrainage

POST /api/referral/stats
  → Récupère les statistiques de parrainage
```

**Comment ça marche:**
1. L'utilisateur partage son code `JD1234`
2. Un ami utilise le lien `voyage-mystere.fr/reserver?ref=JD1234`
3. L'ami obtient 50€ de réduction
4. Après validation de la réservation (30 jours), le parrain reçoit 50€ de crédit

## 🔄 Navigation

### Navbar mise à jour

**Utilisateur non connecté:**
- Bouton "Connexion"
- Bouton "Réserver maintenant"

**Utilisateur connecté:**
- Bouton "Mon Compte" (avec icône utilisateur)
- Bouton "Réserver maintenant"

### Sidebar espace client

Disponible sur toutes les pages de l'espace client:
- 📦 Mes réservations (`/mon-compte`)
- 👤 Mon profil (`/mon-compte/profil`)
- 🎁 Parrainage (`/parrainage`)
- 🚪 Déconnexion

## 🗄️ Structure de données

### Table `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table `bookings` (modifiée)
```sql
-- Peut contenir user_id (utilisateur connecté) OU email (guest booking)
user_id UUID REFERENCES users(id), -- Optionnel
email VARCHAR(255),                 -- Si booking sans compte
first_name VARCHAR(100),
last_name VARCHAR(100),
```

### Table `referrals`
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id), -- Le parrain
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  referred_user_id UUID REFERENCES users(id), -- Le filleul (null si pas encore utilisé)
  status VARCHAR(20), -- 'active', 'pending', 'completed'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table `user_credits`
```sql
CREATE TABLE user_credits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  source VARCHAR(50), -- 'referral', 'promo', etc.
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Configuration requise

### Variables d'environnement

```bash
# Supabase Auth (déjà configuré pour la base de données)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Base URL pour les liens de parrainage
NEXT_PUBLIC_URL=https://voyage-mystere.fr
```

### Configuration Supabase Auth

1. **Activer Email Auth** dans Supabase Dashboard:
   - Allez sur `Authentication → Settings`
   - Activez "Email" provider
   - Configurez l'email template de confirmation

2. **Configurer l'URL de redirection**:
   - Ajoutez vos URLs autorisées dans `Authentication → URL Configuration`
   - Développement: `http://localhost:3000`
   - Production: `https://voyage-mystere.fr`

3. **Désactiver la confirmation d'email** (optionnel pour dev):
   - `Authentication → Settings → Email Auth`
   - Décochez "Enable email confirmations"

## 🔒 Sécurité

### Row Level Security (RLS)

**Table `users`:**
```sql
-- Les utilisateurs peuvent voir et modifier leur propre profil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

**Table `bookings`:**
```sql
-- Les utilisateurs connectés peuvent voir leurs réservations
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.email() = email
  );

-- Les bookings publics sont autorisés (guest checkout)
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);
```

**Table `referrals`:**
```sql
-- Les utilisateurs peuvent voir leurs parrainages
CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own referral code"
  ON referrals FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Protection des routes

Toutes les pages de l'espace client redirigent automatiquement vers `/auth/connexion` si l'utilisateur n'est pas connecté:

```typescript
useEffect(() => {
  if (!loading && !user) {
    router.push('/auth/connexion?redirect=/mon-compte')
  }
}, [user, loading, router])
```

## 📱 Responsive Design

Toutes les pages sont **100% responsive**:
- Mobile: Navigation en colonne, cartes empilées
- Tablet: Grille 2 colonnes pour les stats
- Desktop: Sidebar + contenu principal en grille

## ✨ Fonctionnalités bonus

### Toast notifications
Messages de succès/erreur pour toutes les actions:
- Connexion réussie
- Profil mis à jour
- Code copié
- Erreurs d'authentification

### États de chargement
Spinners pendant:
- Chargement de l'utilisateur
- Récupération des réservations
- Génération du code de parrainage
- Sauvegarde du profil

### Validation de formulaires
Validation en temps réel sur tous les formulaires:
- Emails valides
- Mots de passe sécurisés
- Champs requis
- Messages d'erreur clairs

## 🧪 Test de l'espace client

### 1. Créer un compte
```
1. Aller sur /auth/inscription
2. Remplir le formulaire
3. Créer le compte
4. Se connecter avec /auth/connexion
```

### 2. Voir ses réservations
```
1. Se connecter
2. Aller sur /mon-compte
3. Voir la liste des réservations (peut être vide au début)
4. Faire une réservation via /reserver
5. Revenir sur /mon-compte pour la voir
```

### 3. Tester le parrainage
```
1. Aller sur /parrainage
2. Copier le code de parrainage
3. Ouvrir une navigation privée
4. Aller sur /reserver?ref=VOTRECODE
5. Voir la réduction de 50€ appliquée
```

## 🔄 Flux utilisateur complet

### Réservation avec compte

1. **Utilisateur visite le site** → Non connecté
2. **Clique sur "Réserver"** → /reserver
3. **Choix du thème et dates** → Création booking "draft"
4. **Questionnaire** → Sauvegarde des réponses
5. **Informations personnelles**:
   - Option 1: Se connecter pour pré-remplir
   - Option 2: Remplir manuellement (sera invité à créer compte après)
6. **Paiement** → Stripe checkout
7. **Confirmation** → Booking "confirmed"
8. **Email reçu** → Détails de la réservation
9. **Accès à /mon-compte** → Voir la réservation

### Parcours parrainage

1. **Utilisateur A** se connecte
2. **Va sur /parrainage** → Obtient code `AB1234`
3. **Partage le code** à l'utilisateur B
4. **Utilisateur B** clique sur le lien `/reserver?ref=AB1234`
5. **Utilisateur B réserve** → 50€ de réduction appliqués
6. **Après 30 jours** (période d'annulation):
   - B a crédit utilisé
   - A reçoit 50€ de crédit dans `user_credits`
7. **A peut utiliser** le crédit sur prochaine réservation

## 📊 Prochaines améliorations possibles

- [ ] Upload de photo de profil
- [ ] Historique des paiements
- [ ] Téléchargement des documents de voyage (PDF)
- [ ] Notification par email lors de changement de statut
- [ ] Chat support client
- [ ] Favoris/Wishlist de destinations
- [ ] Calendrier des disponibilités
- [ ] Programme de fidélité avec points
- [ ] Réservations récurrentes
- [ ] Gestion de plusieurs voyageurs

## 🎉 Résumé

L'espace client est maintenant **100% fonctionnel** avec:
- ✅ Authentification Supabase complète
- ✅ Dashboard avec réservations en temps réel
- ✅ Gestion de profil
- ✅ Système de parrainage intégré
- ✅ Navigation adaptée selon l'état de connexion
- ✅ Sécurité RLS configurée
- ✅ Design responsive
- ✅ Validation de formulaires
- ✅ Messages toast
- ✅ États de chargement

**Prêt pour la production !** 🚀
