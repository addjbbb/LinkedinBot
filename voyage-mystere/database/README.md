# 🗄️ Base de Données - Voyage Mystère

## 📋 Instructions de Configuration

### Option 1: Première Installation OU Reset Complet

Si c'est votre première fois ou si vous voulez **tout supprimer et repartir à zéro** :

1. **Ouvrez Supabase SQL Editor**
   - Allez sur https://app.supabase.com
   - Sélectionnez votre projet
   - Cliquez sur **SQL Editor**

2. **Exécutez le script de reset**
   - Ouvrez le fichier `RESET-COMPLET.sql`
   - Copiez **TOUT** le contenu
   - Collez dans SQL Editor
   - Cliquez sur **Run**

3. **Vérifiez les résultats**
   Vous devriez voir :
   ```
   ✅ Base de données créée avec succès !
   Tables créées: 8
   Policies RLS: Configurées pour bookings publics
   Destinations exemple: 3 ajoutées
   ```

4. **C'est fait !**
   - Toutes les tables sont créées
   - Les policies RLS sont configurées (pas besoin d'authentification pour les bookings)
   - 3 destinations d'exemple sont ajoutées

## 🔍 Que contient RESET-COMPLET.sql ?

**8 Tables créées** :
- ✅ `users` - Comptes utilisateurs
- ✅ `bookings` - Réservations (avec support guest checkout)
- ✅ `questionnaire_responses` - Réponses au questionnaire de personnalisation
- ✅ `destinations` - Destinations disponibles
- ✅ `available_dates` - Disponibilités par thème et date
- ✅ `payments` - Transactions Stripe
- ✅ `reviews` - Avis clients
- ✅ `booking_options` - Options additionnelles (champagne, photoshoot, etc.)

**Colonnes de la table bookings** :
- Colonnes de base : `booking_number`, `theme`, `start_date`, `end_date`, `total_price`, `num_guests`, `status`
- Infos client : `email`, `first_name`, `last_name`, `phone`, `address_*`, `city`, `postal_code`, `country`
- Colonnes optionnelles : `user_id`, `destination_id`, `special_requests`, `payment_status`, `stripe_*`, `reveal_code`, etc.

**Policies RLS configurées** :
- ✅ Bookings publics autorisés (INSERT, SELECT, UPDATE)
- ✅ Questionnaire accessible publiquement
- ✅ Destinations et dates disponibles en lecture publique
- ✅ Reviews publiées en lecture publique
- ✅ Payments gérés par service role (Stripe webhooks)

**Données de test** :
- 3 destinations d'exemple (Château Loire, Cabane Arbres, Loft Paris)

## ⚠️ ATTENTION

Le script `RESET-COMPLET.sql` **supprime TOUTES les données existantes** avant de recréer les tables.

**Utilisez-le uniquement si** :
- C'est votre première installation
- Vous voulez repartir à zéro avec une base propre
- Vous avez des erreurs de schema irréparables

**NE L'UTILISEZ PAS si** :
- Vous avez des données de production importantes
- Vous voulez juste ajouter une colonne

## 🧪 Test après installation

Une fois le script exécuté, testez votre application :

```bash
cd /home/user/LinkedinBot/voyage-mystere
npm run dev
```

Puis dans le navigateur :
1. ✅ Choisissez un thème sur la page d'accueil
2. ✅ Sélectionnez des dates
3. ✅ Vérifiez qu'un booking "draft" est créé dans Supabase
4. ✅ Remplissez le questionnaire
5. ✅ Remplissez les informations personnelles

Toutes les étapes devraient fonctionner sans erreur !

## 📊 Vérification dans Supabase

Après avoir testé une réservation :

1. Allez dans **Table Editor** → **bookings**
2. Vous devriez voir votre réservation avec :
   - Un `booking_number` unique (format: VM-TEMP-xxxx)
   - Le `theme` choisi
   - Les `dates` sélectionnées
   - Le `status` = 'draft'
   - Le `total_price`

3. Allez dans **Table Editor** → **questionnaire_responses**
4. Vous devriez voir vos réponses au questionnaire liées au `booking_id`

## 🚀 Prochaines étapes

Après avoir configuré la base de données :

1. ✅ Configurez votre `.env.local` avec les vraies clés Supabase
2. ✅ Configurez Stripe pour les paiements
3. ✅ Ajoutez vos vraies destinations dans la table `destinations`
4. ✅ Configurez les dates disponibles dans `available_dates`
5. ✅ Testez le flux de paiement complet

## ❓ Besoin d'aide ?

Si vous avez des erreurs après avoir exécuté le script :

1. Vérifiez que le script s'est exécuté sans erreur dans Supabase
2. Vérifiez que votre `.env.local` contient les bonnes clés Supabase
3. Redémarrez votre serveur de développement
4. Vérifiez la console du navigateur pour des erreurs

---

**Créé par**: Claude Code
**Dernière mise à jour**: 2025-11-09
