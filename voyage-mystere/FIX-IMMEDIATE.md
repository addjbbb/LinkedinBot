# 🚨 FIX IMMÉDIAT - Table Bookings Incomplète

## Le Problème

Votre table `bookings` dans Supabase a un ancien schema qui **manque de nombreuses colonnes essentielles**.

**Erreurs reçues**:
```
Could not find the 'num_guests' column of 'bookings' in the schema cache
Could not find the 'total_price' column of 'bookings' in the schema cache
```

**Cause**: La table existe mais n'a pas toutes les colonnes requises par l'application.

## ✅ SOLUTION (2 minutes)

### Étape 1: Ouvrir Supabase SQL Editor
1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet **LinkedinBot** (ou le projet que vous utilisez)
3. Dans le menu de gauche, cliquez sur **SQL Editor**

### Étape 2: Exécuter le script de migration
1. Cliquez sur **New query**
2. Copiez **TOUT** le contenu du fichier: `database/migration-update-bookings.sql`
3. Collez-le dans l'éditeur SQL
4. Cliquez sur **Run** (ou appuyez sur Ctrl/Cmd + Enter)

### Étape 3: Vérifier que ça a marché
Vous devriez voir des messages comme:
```
Added column: num_guests
Added column: email
Added column: first_name
...
Migration completed successfully!
```

Si vous voyez "Column X already exists", c'est normal - ça veut dire que cette colonne existait déjà.

### Étape 4: Tester votre site
```bash
# Redémarrez le serveur (Ctrl+C puis)
npm run dev
```

Puis testez le flow de réservation:
1. Choisir un thème
2. Sélectionner des dates
3. L'erreur devrait avoir disparu !

## 🔍 Que fait ce script ?

Le script de migration ajoute **de manière sécurisée** TOUTES les colonnes manquantes:

**Colonnes de base** (essentielles):
- ✅ `booking_number` - Numéro de réservation unique
- ✅ `theme` - Type de voyage (romantique/nature/urbain)
- ✅ `start_date`, `end_date` - Dates du voyage
- ✅ `total_price` - Prix total (✨ CORRIGE L'ERREUR ACTUELLE)
- ✅ `num_guests` - Nombre de voyageurs
- ✅ `status` - Statut de la réservation

**Infos client** (pour réservations sans compte):
- ✅ `email`, `first_name`, `last_name`, `phone`
- ✅ `address_line1`, `address_line2`, `postal_code`, `city`, `country`

**Colonnes optionnelles**:
- ✅ `user_id`, `destination_id` - Références
- ✅ `special_requests` - Demandes spéciales
- ✅ `payment_status` - Statut du paiement
- ✅ `stripe_session_id`, `stripe_payment_intent_id` - Stripe
- ✅ `reveal_code`, `box_shipped_at`, `code_sent_at`
- ✅ `created_at`, `updated_at` - Timestamps

**Note**: Le script est **100% safe** - il vérifie si chaque colonne existe avant de l'ajouter. Vous pouvez l'exécuter plusieurs fois sans problème.

## ❓ Problèmes ?

Si l'erreur persiste après avoir exécuté le script:

### Problème 1: Cache Supabase
Parfois Supabase met du temps à rafraîchir son cache.

**Solution**: Attendez 30 secondes et redémarrez votre serveur.

### Problème 2: Mauvais projet Supabase
Vérifiez que votre `.env.local` pointe vers le bon projet.

```bash
# Dans .env.local, vérifier:
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
```

L'URL doit correspondre au projet où vous avez exécuté le script SQL.

### Problème 3: Permissions RLS
Si vous avez activé Row Level Security (RLS), vous pourriez avoir besoin d'ajuster les policies.

**Vérification rapide dans Supabase**:
1. Allez dans **Table Editor** → **bookings**
2. Cliquez sur **RLS is enabled** (si présent)
3. Ajoutez une policy temporaire pour tester:
```sql
-- Policy temporaire pour debug (À ENLEVER APRÈS TEST)
CREATE POLICY "Allow all for testing"
ON bookings
FOR ALL
USING (true)
WITH CHECK (true);
```

## 📊 Après la correction

Une fois le script exécuté, votre table `bookings` sera à jour et supportera:
- ✅ Réservations avec ou sans compte utilisateur
- ✅ Statut 'draft' pour réservations en cours
- ✅ Toutes les infos client (adresse, téléphone, etc.)
- ✅ Suivi du paiement avec `payment_status`

Vous pourrez alors tester le flux complet de réservation sans erreur !
