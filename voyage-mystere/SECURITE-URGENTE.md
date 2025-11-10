# 🔒 ACTIONS SÉCURITÉ URGENTES - À FAIRE AVANT LANCEMENT

## ⚠️ CRITIQUE - À FAIRE IMMÉDIATEMENT

### 1. Changer le mot de passe admin par défaut
**RISQUE:** Faille de sécurité majeure - n'importe qui peut accéder à l'admin

**Action:**
1. Se connecter sur https://votre-domaine.com/admin/login
2. Email: `admin@voyage-mystere.fr`
3. Mot de passe actuel: `admin123` ⚠️
4. **CHANGER IMMÉDIATEMENT** vers un mot de passe fort (20+ caractères, aléatoire)

**Comment changer:**
```sql
-- Dans Supabase SQL Editor
UPDATE admins
SET password = crypt('VOTRE_NOUVEAU_MOT_DE_PASSE_FORT', gen_salt('bf'))
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
