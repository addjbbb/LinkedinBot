# Système de Codes de Révélation - Configuration

## Vue d'ensemble

Le système de codes de révélation est le **cœur de l'expérience Voyage Mystère**. 48 heures avant le départ, les voyageurs reçoivent automatiquement :

1. Un code unique (format: `XXXX-XXXX`)
2. Un email révélant leur destination
3. Toutes les informations pour préparer leur voyage

## Étapes de Configuration

### 1. Appliquer la Migration de Base de Données

Exécutez le script SQL dans votre dashboard Supabase :

```sql
-- Add revelation_code column to bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS revelation_code VARCHAR(20) UNIQUE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_revelation_code ON bookings(revelation_code);
CREATE INDEX IF NOT EXISTS idx_bookings_start_date_status ON bookings(start_date, status)
WHERE status = 'confirmed';

-- Add comment
COMMENT ON COLUMN bookings.revelation_code IS 'Unique code sent 48h before trip to reveal destination';
```

Vérifiez que la migration a réussi :

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings' AND column_name = 'revelation_code';
```

### 2. Configurer les Variables d'Environnement

Ajoutez dans votre fichier `.env` ou dans Vercel :

```bash
CRON_SECRET=your-random-secret-key-here-min-32-chars
```

**Générez une clé sécurisée :**

```bash
# Sur macOS/Linux
openssl rand -base64 32

# Ou utilisez un générateur en ligne
# https://www.uuidgenerator.net/
```

### 3. Configurer Vercel Cron (Recommandé)

Le fichier `vercel.json` est déjà configuré pour exécuter le cron job :

```json
{
  "crons": [
    {
      "path": "/api/cron/revelation-codes",
      "schedule": "0 10,18 * * *"
    }
  ]
}
```

**Planning** : Exécution à 10h00 et 18h00 (UTC) chaque jour.

**Déploiement** :

1. Push votre code sur GitHub
2. Vercel détectera automatiquement `vercel.json`
3. Le cron sera activé après le déploiement

**Vérification** :

1. Allez dans Vercel Dashboard → Votre Projet → Settings → Cron
2. Vous devriez voir le cron listé
3. Testez avec "Run Now"

### 4. Alternative : GitHub Actions

Si vous n'utilisez pas Vercel, créez `.github/workflows/revelation-codes.yml` :

```yaml
name: Process Revelation Codes

on:
  schedule:
    # Runs at 10:00 and 18:00 UTC daily
    - cron: '0 10,18 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  process-codes:
    runs-on: ubuntu-latest
    steps:
      - name: Call Revelation Code Endpoint
        run: |
          curl -X GET "https://votre-domaine.com/api/cron/revelation-codes" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -v

      - name: Check Response
        if: failure()
        run: echo "Failed to process revelation codes"
```

**Configuration** :

1. Ajoutez `CRON_SECRET` dans GitHub Secrets (Settings → Secrets → Actions)
2. Commit et push le fichier workflow
3. Vérifiez dans Actions tab

### 5. Test Manuel

Testez le système avant le lancement :

**Avec curl** :

```bash
curl -X POST "https://votre-domaine.com/api/cron/revelation-codes" \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

**Réponse attendue** :

```json
{
  "success": true,
  "timestamp": "2025-11-10T10:00:00.000Z",
  "result": {
    "bookingsProcessed": 3,
    "codesGenerated": 2,
    "emailsSent": 3,
    "errors": []
  }
}
```

**Depuis votre navigateur (pour test)** :

Créez une route de test temporaire dans `/app/api/test-revelation/route.ts` :

```typescript
import { processRevelationCodes } from '@/lib/revelation-code'

export async function GET() {
  const result = await processRevelationCodes()
  return Response.json(result)
}
```

Puis visitez : `https://votre-domaine.com/api/test-revelation`

⚠️ **Supprimez cette route après les tests !**

## Fonctionnement du Système

### Workflow Automatique

1. **Cron Job** s'exécute 2x par jour (10h et 18h)
2. **Recherche** les réservations confirmées dont `start_date` est dans 48-49h
3. Pour chaque réservation :
   - Génère un code unique `XXXX-XXXX` (si pas déjà existant)
   - Stocke le code dans `bookings.revelation_code`
   - Envoie l'email de révélation avec :
     - Le code
     - La destination (nom + région)
     - Date de départ
     - Checklist de préparation
4. **Logs** les résultats pour monitoring

### Génération des Codes

**Format** : `AB7K-M3Q9`
- 8 caractères alphanumériques majuscules
- Séparateur au milieu pour lisibilité
- Totalement aléatoire (crypto-secure)
- Vérification d'unicité dans la base

**Collision** : Probabilité ~1/1,000,000,000 (36^8)

### Email Template

L'email inclut :

✅ Grande révélation de la destination avec effet visuel
✅ Code de révélation bien visible
✅ Date de départ formatée en français
✅ Checklist de dernière minute
✅ Informations de contact urgence
✅ Version HTML + texte brut

**Template** : `lib/email-templates.ts` → `getRevelationEmail()`

## Monitoring et Logs

### Consulter les Logs

**Vercel** :

1. Dashboard → Votre Projet → Logs
2. Filtrez par `/api/cron/revelation-codes`
3. Cherchez les messages :
   - `🕐 Starting revelation code cron job...`
   - `📋 Found X bookings needing revelation codes`
   - `✅ Revelation code cron job completed`

**GitHub Actions** :

1. Repository → Actions
2. Sélectionnez le workflow "Process Revelation Codes"
3. Consultez les logs d'exécution

### Messages Importants

```
✅ Revelation code XXXX-XXXX assigned to booking 12345
📧 Revelation email sent to user@example.com (Booking: VM-2025-11-1234)
⚠️ No destination match found for booking...
❌ Failed to generate code for booking...
```

## Sécurité

### Protection du Endpoint

❌ **JAMAIS** exposer publiquement sans authentification
✅ Toujours utiliser `CRON_SECRET`
✅ Vérifier `Authorization: Bearer {secret}` header
✅ Logs d'accès pour détecter tentatives non autorisées

### Variables Sensibles

Ne JAMAIS commiter :
- `CRON_SECRET`
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Toujours utiliser :
- `.env.local` (local)
- Vercel Environment Variables (production)
- GitHub Secrets (CI/CD)

## Dépannage

### Problème : Aucun code généré

**Vérifications** :

1. Réservations confirmées avec `start_date` dans 48h ?

```sql
SELECT id, booking_number, start_date, status, destination_id
FROM bookings
WHERE status = 'confirmed'
  AND start_date >= CURRENT_DATE + INTERVAL '48 hours'
  AND start_date <= CURRENT_DATE + INTERVAL '49 hours';
```

2. Destinations assignées ?

```sql
SELECT COUNT(*) FROM bookings
WHERE status = 'confirmed' AND destination_id IS NULL;
```

### Problème : Emails non envoyés

**Vérifications** :

1. `RESEND_API_KEY` configurée ?
2. Email validé dans Resend Dashboard ?
3. Logs d'erreur Resend ?
4. Quota email non dépassé ?

**Test Resend** :

```bash
curl https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_RESEND_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@voyage-mystere.fr",
    "to": "test@example.com",
    "subject": "Test",
    "html": "<p>Test</p>"
  }'
```

### Problème : Codes en double

**Vérification** :

```sql
SELECT revelation_code, COUNT(*)
FROM bookings
WHERE revelation_code IS NOT NULL
GROUP BY revelation_code
HAVING COUNT(*) > 1;
```

Si des doublons existent, régénérez :

```sql
UPDATE bookings
SET revelation_code = NULL
WHERE revelation_code IN (
  SELECT revelation_code FROM bookings
  WHERE revelation_code IS NOT NULL
  GROUP BY revelation_code HAVING COUNT(*) > 1
);
```

Puis relancez le cron job.

## Maintenance

### Désactiver Temporairement

**Vercel** :
1. Dashboard → Settings → Cron Jobs
2. Pause le cron

**GitHub Actions** :
1. Commentez le `schedule:` dans `.github/workflows/revelation-codes.yml`
2. Push les changements

### Réactiver

Reverse les étapes ci-dessus.

### Historique des Codes

Requête pour voir l'historique :

```sql
SELECT
  b.booking_number,
  b.revelation_code,
  b.start_date,
  b.status,
  d.name as destination,
  b.created_at
FROM bookings b
LEFT JOIN destinations d ON b.destination_id = d.id
WHERE b.revelation_code IS NOT NULL
ORDER BY b.start_date DESC;
```

## FAQ

**Q : Que se passe-t-il si le cron échoue un jour ?**
R : Le lendemain, il détectera toujours les réservations dans la fenêtre 48h, donc pas de perte. Mais configurez des alertes pour être notifié.

**Q : Peut-on changer le timing (pas 48h) ?**
R : Oui, modifiez la logique dans `lib/revelation-code.ts` → `getBookingsNeedingRevelation()`.

**Q : Peut-on renvoyer un code à un client ?**
R : Oui, créez un endpoint admin ou régénérez manuellement via SQL :

```sql
SELECT revelation_code FROM bookings
WHERE booking_number = 'VM-2025-11-1234';
```

**Q : Les codes peuvent-ils expirer ?**
R : Non, par défaut. Mais vous pouvez ajouter une logique d'expiration basée sur `start_date` si nécessaire.

## Support

En cas de problème critique (J-jour) :

1. Consultez les logs Vercel/GitHub Actions
2. Vérifiez Supabase → Table Editor → `bookings`
3. Testez manuellement l'endpoint avec curl
4. Contactez support Resend si problème email
5. Générez et envoyez codes manuellement si urgence absolue

---

**Date de création** : 2025-11-10
**Auteur** : Claude
**Version** : 1.0
