# 🔒 ACTIONS SÉCURITÉ URGENTES - À FAIRE AVANT LANCEMENT

## ⚠️ CRITIQUE - À FAIRE IMMÉDIATEMENT

### 1. Changer le mot de passe admin par défaut
**RISQUE:** Faille de sécurité majeure - n'importe qui peut accéder à l'admin

**STATUS:** ✅ Système de changement forcé implémenté

**Avant de lancer:**
1. Appliquer la migration: `database/migrations/004_add_admin_password_change_flag.sql`
2. À la première connexion admin, le système forcera le changement de mot de passe

**Connexion initiale:**
- Email: `admin@voyage-mystere.fr`
- Mot de passe: `admin123` ⚠️ (valable UNE SEULE FOIS)

**Système automatique:**
- Flag `must_change_password` activé pour l'admin par défaut
- Login retourne `mustChangePassword: true`
- Frontend doit rediriger vers page de changement
- API endpoint: `POST /api/admin/auth/change-password`

**Validation robuste du nouveau mot de passe:**
- ✅ Minimum 12 caractères
- ✅ Au moins 1 majuscule
- ✅ Au moins 1 minuscule
- ✅ Au moins 1 chiffre
- ✅ Au moins 1 caractère spécial
- ✅ Flag `must_change_password` automatiquement désactivé après changement

**Alternative manuelle (via API):**
```bash
# Générer un mot de passe fort
openssl rand -base64 24

# Changer via API
curl -X POST "https://votre-domaine.com/api/admin/auth/change-password" \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"newPassword": "VotreNouveauMotDePasseTresFort123!@#"}'
```

**En cas d'urgence (reset manuel via SQL):**
```sql
-- Utiliser un générateur de hash bcrypt en ligne:
-- https://bcrypt-generator.com/ (rounds: 10)
-- Puis mettre à jour:
UPDATE admins
SET
  password_hash = '$2a$10$VotrHashBcryptIci',
  must_change_password = false,
  updated_at = NOW()
WHERE email = 'admin@voyage-mystere.fr';
```

---

## ✅ CORRECTIONS APPLIQUÉES

### Redirections d'authentification corrigées
- Login redirige maintenant vers `/espace-client` ✅
- Anciennes pages `/login` et `/inscription` supprimées ✅

### Routes protégées par middleware
- `/espace-client/*` nécessite authentification ✅
- Redirection automatique vers login si non connecté ✅
- Token Supabase vérifié côté serveur ✅

---

## 📋 AUTRES ACTIONS RECOMMANDÉES

### 2. Variables d'environnement
Vérifier que toutes les clés sont présentes dans `.env`:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # ⚠️ CRITIQUE pour webhooks
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
```

### 3. Webhook Stripe
- Vérifier que l'URL webhook est configurée dans Stripe Dashboard
- URL: `https://votre-domaine.com/api/webhooks/stripe`
- Événements à écouter: `checkout.session.completed`, `payment_intent.payment_failed`

### 4. Emails
- Tester l'envoi d'emails via Resend
- Vérifier que le domaine est vérifié dans Resend

---

## 🔍 TESTS À FAIRE AVANT LANCEMENT

1. **Parcours complet utilisateur:**
   - [ ] Inscription → email reçu
   - [ ] Connexion → redirige vers /espace-client
   - [ ] Réservation → brouillon sauvegardé
   - [ ] Code promo → réduction appliquée
   - [ ] Paiement Stripe → confirmation reçue
   - [ ] Statut booking → passe à "Confirmé" après paiement

2. **Sécurité:**
   - [ ] Accès /espace-client sans login → redirige vers connexion
   - [ ] Accès /admin sans login → redirige vers admin/login
   - [ ] Mot de passe admin changé

3. **Performance:**
   - [ ] Images optimisées
   - [ ] Temps de chargement < 3s

---

## 📞 SUPPORT

En cas de problème critique pendant le lancement:
1. Vérifier les logs Vercel/Console
2. Vérifier les logs Supabase
3. Vérifier les webhooks Stripe (Dashboard → Developers → Webhooks)
