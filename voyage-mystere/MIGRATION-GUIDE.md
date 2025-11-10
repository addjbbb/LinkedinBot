# Guide de Migration - Voyage Mystère

## Migration Urgente Avant Lancement

Ce guide décrit les migrations de base de données à appliquer **AVANT** le lancement du site ce soir.

### Migration 002: Ajout du champ destination_id

**Fichier**: `database/migrations/002_add_destination_to_bookings.sql`

**Description**: Ajoute la relation entre réservations et destinations pour permettre l'assignation automatique basée sur le questionnaire.

**Comment appliquer**:

1. Connectez-vous à votre dashboard Supabase
2. Allez dans **SQL Editor**
3. Copiez et exécutez le SQL suivant:

```sql
-- Add destination_id column to bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_destination_id ON bookings(destination_id);

-- Add comment
COMMENT ON COLUMN bookings.destination_id IS 'Assigned destination based on questionnaire matching algorithm';
```

4. Vérifiez que la migration a réussi:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'bookings' AND column_name = 'destination_id';
```

Vous devriez voir:
```
column_name     | data_type
----------------|----------
destination_id  | uuid
```

### Vérification Post-Migration

Après avoir appliqué la migration, testez le système:

1. **Testez l'API de disponibilités**:
   ```bash
   curl "https://votre-domaine.com/api/available-dates?theme=romantique"
   ```

2. **Testez l'assignation de destination**:
   - Créez une réservation test
   - Remplissez le questionnaire
   - Vérifiez que la destination est assignée:
   ```sql
   SELECT id, booking_number, theme, destination_id
   FROM bookings
   WHERE destination_id IS NOT NULL
   ORDER BY created_at DESC
   LIMIT 5;
   ```

3. **Vérifiez les logs**:
   - Ouvrez la console de votre application
   - Cherchez les messages "🎯 Destination Matching Results"
   - Vérifiez qu'il n'y a pas d'erreurs

### Rollback (si nécessaire)

Si vous devez annuler la migration:

```sql
-- Remove the column
ALTER TABLE bookings DROP COLUMN IF EXISTS destination_id;

-- Remove the index
DROP INDEX IF EXISTS idx_bookings_destination_id;
```

⚠️ **ATTENTION**: Le rollback supprimera toutes les assignations de destinations existantes.

## Nouvelles Fonctionnalités

### 1. Système de disponibilités réel
- Vérifie les dates disponibles dans `available_dates`
- Affiche uniquement les dates avec capacité
- Mise à jour en temps réel

### 2. Algorithme d'assignation de destinations
- Score basé sur 8 critères du questionnaire
- Évite les régions déjà visitées
- Prend en compte les phobies et contraintes
- Logging détaillé pour debug

**Critères de scoring**:
- Thème (40 pts) - CRITIQUE
- Région non visitée (20 pts)
- Style de voyageur (15 pts)
- Occasion (10 pts)
- Rythme (5 pts)
- Type d'hébergement (5 pts)
- Pénalités pour phobies incompatibles (-10 à -15 pts)

### 3. Protection des routes /espace-client
- Vérification côté serveur
- Redirection automatique vers login
- Session Supabase validée

## Support

En cas de problème:
1. Vérifiez les logs de la console
2. Vérifiez les erreurs SQL dans Supabase
3. Consultez `lib/destination-matcher.ts` pour le détail de l'algorithme
