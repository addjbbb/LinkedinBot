# 🚀 COMMENT LANCER LE SERVEUR

## 📋 AVANT DE LANCER

### 1. Migrations Base de Données (5 min)

**Aller sur Supabase** : https://supabase.com/dashboard

**SQL Editor** → Copier/coller ces 3 migrations :

```sql
-- Migration 002: destination_id
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_destination_id ON bookings(destination_id);

-- Migration 003: revelation_code
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS revelation_code VARCHAR(20) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_bookings_revelation_code ON bookings(revelation_code);
CREATE INDEX IF NOT EXISTS idx_bookings_start_date_status ON bookings(start_date, status)
WHERE status = 'confirmed';

-- Migration 004: must_change_password
ALTER TABLE admins
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

UPDATE admins
SET must_change_password = true
WHERE email = 'admin@voyage-mystere.fr';
```

**Vérifier** :
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'bookings' AND column_name IN ('destination_id', 'revelation_code');

SELECT column_name FROM information_schema.columns
WHERE table_name = 'admins' AND column_name = 'must_change_password';
```

---

### 2. Variables d'Environnement

**Créer `.env.local`** dans `/voyage-mystere/` :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (Emails)
RESEND_API_KEY=re_...

# Cron Security
CRON_SECRET=xxx  # Générer avec: openssl rand -base64 32

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Où trouver les clés ?**
- Supabase : Dashboard → Project Settings → API
- Stripe : Dashboard → Developers → API Keys
- Resend : Dashboard → API Keys
- CRON_SECRET : Générer avec `openssl rand -base64 32`

---

## 🏃 LANCER LE SERVEUR

### Installation des dépendances

```bash
cd voyage-mystere
npm install
```

### Lancer en mode développement

```bash
npm run dev
```

**Le site sera accessible sur** : http://localhost:3000

---

## 🧪 TESTER LE SITE

### 1. Test Utilisateur Complet

1. **Inscription** : http://localhost:3000/auth/inscription
   - Créer un compte
   - Vérifier redirection vers `/espace-client`

2. **Réservation** :
   - Choisir un thème (Romantique / Nature / Urbain)
   - Sélectionner dates (toutes les dates futures sont dispo)
   - Remplir le questionnaire (15 questions)
   - Page récapitulatif → Tester code promo si disponible
   - Cliquer "Payer" (Stripe test mode)

3. **Paiement Stripe** :
   - Carte test : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : 123
   - Vérifier confirmation

4. **Vérifier en DB** :
   ```sql
   SELECT id, booking_number, status, destination_id
   FROM bookings
   ORDER BY created_at DESC
   LIMIT 1;
   ```
   - `status` doit être `'confirmed'`
   - `destination_id` doit être assigné (pas NULL)

### 2. Test Admin

1. **Login** : http://localhost:3000/admin/login
   - Email : `admin@voyage-mystere.fr`
   - Mot de passe : `admin123` (première fois seulement)

2. **Changer mot de passe** (OBLIGATOIRE) :
   ```bash
   # Générer un mot de passe fort
   openssl rand -base64 24

   # Appeler l'API (après login)
   curl -X POST "http://localhost:3000/api/admin/auth/change-password" \
     -H "Authorization: Bearer VOTRE_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"newPassword": "VotreNouveauMotDePasseFort123!@#"}'
   ```

---

## 📦 DEPLOYER SUR VERCEL

### 1. Connecter GitHub

```bash
# Si pas déjà fait
git remote add origin https://github.com/votre-username/votre-repo.git
git push -u origin main
```

### 2. Importer sur Vercel

1. Aller sur https://vercel.com
2. "New Project" → Importer votre repo GitHub
3. **Root Directory** : `voyage-mystere`
4. **Framework Preset** : Next.js
5. Cliquer "Deploy"

### 3. Configurer les Variables d'Environnement

**Vercel Dashboard** → Votre Projet → **Settings** → **Environment Variables**

Ajouter TOUTES les variables du `.env.local` :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` ⚠️ CRITIQUE
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `CRON_SECRET`
- `NEXT_PUBLIC_BASE_URL` (mettre votre domaine Vercel)

**Puis "Redeploy"** pour appliquer les variables.

### 4. Configurer le Webhook Stripe

1. **Stripe Dashboard** → Developers → Webhooks
2. "Add endpoint"
3. **URL** : `https://votre-domaine.vercel.app/api/webhooks/stripe`
4. **Events** :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copier le "Signing secret" → Mettre dans `STRIPE_WEBHOOK_SECRET`

### 5. Vérifier le Cron Job

**Vercel Dashboard** → Votre Projet → **Settings** → **Cron Jobs**

Vous devriez voir :
- Path : `/api/cron/revelation-codes`
- Schedule : `0 10,18 * * *` (10h et 18h UTC)

**Test manuel** :
```bash
curl -X POST "https://votre-domaine.vercel.app/api/cron/revelation-codes" \
  -H "Authorization: Bearer VOTRE_CRON_SECRET"
```

---

## 🎉 C'EST PRÊT !

**Le site est maintenant lancé avec** :
- ✅ Toutes les dates disponibles pour réservation
- ✅ Code promo et parrainage fonctionnels
- ✅ Matching automatique des destinations (algorithme 8 critères)
- ✅ Codes de révélation automatiques (cron J-2)
- ✅ Emails automatisés (confirmation, révélation, etc.)
- ✅ Paiement Stripe sécurisé
- ✅ Protection des routes admin et client

---

## 🆘 PROBLÈMES COURANTS

### Le serveur ne démarre pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreur "Module not found"
```bash
# Vérifier que vous êtes dans le bon dossier
cd voyage-mystere
pwd  # Doit afficher: .../LinkedinBot/voyage-mystere
npm install
```

### Webhook Stripe ne fonctionne pas
- Vérifier que `SUPABASE_SERVICE_ROLE_KEY` est bien configuré
- Vérifier les logs Stripe Dashboard → Developers → Webhooks
- Voir les logs Vercel pour les erreurs

### Emails non reçus
- Vérifier que `RESEND_API_KEY` est configuré
- Vérifier que votre domaine est validé dans Resend
- Checker spam/courrier indésirable

---

## 📞 SUPPORT

**Logs Vercel** : https://vercel.com/dashboard → Votre Projet → Logs
**Logs Supabase** : https://supabase.com/dashboard → Votre Projet → Logs
**Stripe Dashboard** : https://dashboard.stripe.com

---

**Bon lancement ! 🚀**
