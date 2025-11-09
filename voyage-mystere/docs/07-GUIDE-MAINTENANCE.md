# 🔧 GUIDE DE MAINTENANCE - Voyage Mystère

> **Pour modifier le site SANS compétences en développement**

---

## 📋 TABLE DES MATIÈRES

1. [Modifications Simples (Sans Code)](#-modifications-simples-sans-code)
2. [Utiliser Sanity CMS](#-utiliser-sanity-cms)
3. [Modifier les Textes](#-modifier-les-textes)
4. [Ajouter/Modifier des Images](#-ajoutermodifier-des-images)
5. [Gérer les Témoignages](#-gérer-les-témoignages)
6. [Gérer le Blog](#-gérer-le-blog)
7. [Modifier les Prix](#-modifier-les-prix)
8. [Ajouter une Destination](#-ajouter-une-destination)
9. [Emails Automatiques](#-emails-automatiques)
10. [Suivre les Réservations](#-suivre-les-réservations)
11. [Analytics & Performance](#-analytics--performance)
12. [FAQ Maintenance](#-faq-maintenance)

---

## ✅ MODIFICATIONS SIMPLES (Sans Code)

### Ce que vous pouvez modifier SANS toucher au code

✅ **Contenus textuels** (via Sanity CMS)
✅ **Images et vidéos** (via Cloudinary + Sanity)
✅ **Articles de blog** (via Sanity CMS)
✅ **Témoignages** (via Sanity CMS)
✅ **FAQ** (via Sanity CMS)
✅ **Prix des formules** (via fichier config simple)
✅ **Emails** (templates modifiables)

### Ce qui nécessite un développeur

❌ Ajouter une nouvelle page complexe
❌ Modifier le tunnel de réservation
❌ Changer le design (couleurs, fonts) → (modifiable mais nécessite bases CSS)
❌ Intégrer un nouveau service (nouveau paiement, nouveau CRM...)

---

## 🎨 UTILISER SANITY CMS

Sanity est votre interface d'administration. C'est là que vous modifiez 80% du contenu.

### Accéder à Sanity Studio

1. **URL** : `https://votre-projet.sanity.studio`
   (ou localement : `npm run sanity:dev` puis `http://localhost:3333`)

2. **Se connecter** : Utilisez votre compte Google ou email

3. **Interface** : Vous voyez des sections :
   - 📝 Articles de blog
   - 💬 Témoignages
   - ❓ FAQ
   - 🎯 Destinations
   - ⚙️ Paramètres

---

## ✍️ MODIFIER LES TEXTES

### Modifier la Homepage

**Via Sanity Studio :**

1. Allez dans **"Pages" → "Homepage"**
2. Vous voyez des champs éditables :
   ```
   Hero Title : "Votre prochaine aventure commence ici..."
   Hero Subtitle : "Week-end surprise haut de gamme..."
   Hero CTA Text : "Réserver mon voyage mystère"
   ```
3. Modifiez directement le texte
4. Cliquez **"Publish"** en haut à droite
5. Actualisez votre site → Le changement est live ! ✅

**Exemple :**

```
Avant : "Votre prochaine aventure commence ici"
Après : "Partez à l'aventure sans savoir où"

→ Changez juste dans Sanity, pas besoin de code !
```

### Modifier une page entière (ex: Comment ça marche)

1. Sanity Studio → **"Pages" → "Comment ça marche"**
2. Vous avez un éditeur riche (comme Word) :
   - Titres (H1, H2, H3)
   - Paragraphes
   - Listes à puces
   - Liens
   - Images

3. Modifiez comme dans un document Word
4. **Publish**
5. C'est en ligne !

---

## 🖼️ AJOUTER/MODIFIER DES IMAGES

### Via Cloudinary (Recommandé pour les images optimisées)

**Étape 1 : Uploader l'image**

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Connectez-vous
3. Allez dans **"Media Library"**
4. Cliquez **"Upload"**
5. Sélectionnez votre image (JPG, PNG, WebP)
6. Elle s'upload automatiquement

**Étape 2 : Récupérer l'URL**

1. Cliquez sur l'image uploadée
2. Cliquez sur le bouton **"Copy URL"**
3. Vous avez une URL du type :
   ```
   https://res.cloudinary.com/votre-cloud/image/upload/v123456/voyage-mystere/hero.jpg
   ```

**Étape 3 : L'utiliser dans Sanity**

1. Allez dans Sanity Studio
2. Trouvez le champ "Image" à modifier (ex: Hero Image)
3. Collez l'URL Cloudinary
4. Ou utilisez le bouton "Upload" directement dans Sanity (il upload vers Cloudinary automatiquement)
5. **Publish**

### Bonnes pratiques Images

✅ **Format** : JPG pour photos, PNG pour logos, WebP si possible (plus léger)
✅ **Taille** : Max 1920px de large (Cloudinary optimise auto après)
✅ **Poids** : Visez < 500KB par image (Cloudinary compresse auto)
✅ **Nommage** : `hero-couple-romantique.jpg` (descriptif, sans espaces)

**Ne JAMAIS** :
❌ Uploader des images de 5MB+ (site sera lent)
❌ Utiliser des captures d'écran basse qualité
❌ Mettre des images sans alt text (mauvais pour SEO)

---

## 💬 GÉRER LES TÉMOIGNAGES

### Ajouter un nouveau témoignage

**Via Sanity Studio :**

1. Allez dans **"Témoignages"**
2. Cliquez **"+ Créer un nouveau témoignage"**
3. Remplissez le formulaire :

```
Nom du couple : Julie & Marc
Âge : 29 et 32 ans
Ville : Paris
Thématique : Romantique
Destination révélée : Annecy
Note : 5 étoiles (sélecteur)

Titre : "Le plus beau cadeau de nos 5 ans !"

Témoignage (texte long) :
[Collez le texte complet du témoignage]

Photos :
[Upload 3-5 photos du couple]

Vidéo (optionnel) :
[URL YouTube ou upload]

Publié : ☑ Oui (cochez pour rendre visible)
Mis en avant sur homepage : ☐ Non (cochez si vous voulez qu'il apparaisse en premier)

Date : 15/06/2024
```

4. **Publish**
5. Le témoignage apparaît sur `/temoignages` automatiquement !

### Modifier un témoignage existant

1. **"Témoignages"** → Cliquez sur celui à modifier
2. Changez ce que vous voulez
3. **Publish**

### Supprimer un témoignage

1. **"Témoignages"** → Cliquez sur celui à supprimer
2. Menu `⋯` en haut à droite → **"Delete"**
3. Confirmez

---

## 📝 GÉRER LE BLOG

### Créer un nouvel article

**Sanity Studio → "Blog" → "+ Créer un article"**

```
Titre : "10 destinations romantiques à moins de 2h de Paris"

Slug : destinations-romantiques-paris
(URL de l'article : /blog/destinations-romantiques-paris)

Extrait (résumé court) :
"Découvrez nos 10 destinations coup de cœur pour un week-end romantique
sans aller trop loin de la capitale."

Image de couverture :
[Upload une belle photo]

Catégorie : Destinations / Conseils / Témoignages
Tags : romantique, france, week-end

Contenu (éditeur riche) :
[Rédigez votre article comme dans Word]

SEO :
  Meta Title : "10 Destinations Romantiques près de Paris (2024)"
  Meta Description : "Annecy, Étretat, Loire... Découvrez les plus belles
  destinations romantiques à moins de 2h de Paris. Conseils & bons plans."

Auteur : Voyage Mystère Team
Publié : ☑ Oui
Date de publication : 15/11/2024
```

**Publish** → L'article est en ligne à `/blog/destinations-romantiques-paris`

### Bonnes Pratiques SEO Blog

✅ **Titre** : 50-60 caractères, avec mot-clé principal
✅ **Meta Description** : 150-155 caractères, incite au clic
✅ **Slug** : Court, avec tirets, mot-clé dedans
✅ **Contenu** : Minimum 800 mots pour SEO
✅ **Images** : Au moins 1 image de qualité
✅ **Liens internes** : Lien vers d'autres pages du site (ex: `/destinations/romantique`)

**Mots-clés cibles pour articles :**
- "voyage mystère"
- "week-end surprise"
- "destinations romantiques"
- "idée cadeau original"
- "surprise voyage"

---

## 💰 MODIFIER LES PRIX

### Changer le prix d'une formule

**Option 1 : Via Sanity (Recommandé)**

1. Sanity Studio → **"Paramètres" → "Tarifs"**
2. Vous voyez :
   ```
   Formule Romantique : 890€
   Formule Nature : 750€
   Formule Urbain : 820€

   Options :
   - Upgrade Suite : 150€
   - Champagne : 40€
   - Shooting Photo : 150€
   - Panier Gourmand : 45€
   ```
3. Modifiez les valeurs
4. **Publish**
5. Les prix sont mis à jour partout automatiquement !

**Option 2 : Via fichier config (si pas Sanity)**

Ouvrir le fichier `/lib/pricing.ts` :

```typescript
// lib/pricing.ts
export const pricing = {
  themes: {
    romantique: 890,
    nature: 750,
    urbain: 820,
  },
  options: {
    upgradeSuite: 150,
    champagne: 40,
    photoshoot: 150,
    basket: 45,
  },
  // Tarifs Stripe (en centimes)
  stripe: {
    romantique: 89000, // 890€ x 100
    nature: 75000,
    urbain: 82000,
  },
};
```

**IMPORTANT** : Si vous changez les prix, pensez à :
1. Modifier le prix affiché (ex: 890€)
2. Modifier le prix Stripe (8900**0** centimes)
3. Mettre à jour les produits dans le Dashboard Stripe

---

## 🗺️ AJOUTER UNE DESTINATION

### Process pour ajouter "Marseille - Formule Urbain"

**Étape 1 : Tester la destination**

Avant d'ajouter, vous devez avoir :
- ✅ Testé l'hébergement (qualité 4*)
- ✅ Identifié 1 activité signature (food tour, street art...)
- ✅ Rédigé le carnet de voyage (20+ bonnes adresses)
- ✅ Pris des photos de qualité

**Étape 2 : Ajouter dans Sanity**

Sanity Studio → **"Destinations" → "+ Nouvelle destination"**

```
Nom : Marseille
Région : Provence-Alpes-Côte d'Azur
Pays : France

Thématique : Urbain

Description courte :
"Soleil, mer, architecture colorée et street art incroyable."

Description longue :
"Marseille vous surprendra par son authenticité, ses quartiers branchés
(Le Panier, Cours Julien), sa cuisine méditerranéenne..."

Distance depuis Paris : 750 km
Mode de transport recommandé : Train (TGV 3h) ou Avion (1h)

Hébergement :
  Nom : Hôtel La Résidence du Vieux-Port
  Type : Boutique hotel
  Étoiles : 4*
  Description : "Vue sur le Vieux-Port, design provençal moderne..."
  Prix/nuit : 180€

Activité signature :
  Nom : Street Art Tour avec artiste local
  Description : "3h de découverte..."
  Prix : Inclus

Carnet de voyage (fichier PDF) :
[Upload marseille-carnet.pdf]

Photos (5-10) :
[Upload photos Vieux-Port, Panier, Calanques...]

Saison recommandée : Printemps, Été, Automne
Éviter en : Hiver (mistral froid)

Difficulté : Facile (beaucoup de marche mais plat)

Statut : ☐ Publié (cochez quand prêt)
```

**Publish**

**Étape 3 : Tester la réservation**

1. Allez sur le site en mode test
2. Réservez "Urbain" pour les dates où Marseille est dispo
3. Vérifiez que tout fonctionne (questionnaire, paiement test...)

---

## 📧 EMAILS AUTOMATIQUES

### Modifier un email (ex: Email de confirmation)

**Via fichiers templates React Email :**

1. Ouvrir `/emails/confirmation.tsx`

2. Vous voyez du code HTML-like :

```tsx
<Heading>🎉 {firstName}, votre aventure commence !</Heading>

<Text>Votre réservation est confirmée ! Voici votre récapitulatif :</Text>
```

3. Modifiez le texte entre les balises :

```tsx
// AVANT
<Text>Votre réservation est confirmée !</Text>

// APRÈS
<Text>Félicitations ! Votre voyage mystère est réservé 🎉</Text>
```

4. **Prévisualiser l'email** :

```bash
npm run email:dev
# Ouvrir http://localhost:3000
```

5. Une fois satisfait, **commit & push** → Vercel redéploie auto

### Liste des emails automatiques

| Email | Déclencheur | Fichier |
|-------|-------------|---------|
| Confirmation | Paiement validé | `/emails/confirmation.tsx` |
| Boîte expédiée | J-10 | `/emails/box-shipped.tsx` |
| Rappel J-3 | J-3 | `/emails/reminder.tsx` |
| Code révélation | J-2 à 18h | `/emails/reveal-code.tsx` |
| Demande avis | J+3 | `/emails/review-request.tsx` |

### Changer l'heure d'envoi du code (actuellement 18h)

1. Ouvrir `/app/api/cron/send-reveal-code/route.ts`

2. Trouver la ligne :

```typescript
.eq('start_date', addDays(new Date(), 2))
```

3. La logique est déjà là, mais l'heure est définie dans `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reveal-code",
      "schedule": "0 18 * * *"  // <-- 18h (format cron)
    }
  ]
}
```

4. Pour envoyer à **20h** au lieu de 18h :

```json
"schedule": "0 20 * * *"  // 20h
```

5. Commit & push

**Format Cron :**
```
┌───────────── minute (0 - 59)
│ ┌───────────── heure (0 - 23)
│ │ ┌───────────── jour du mois (1 - 31)
│ │ │ ┌───────────── mois (1 - 12)
│ │ │ │ ┌───────────── jour de la semaine (0 - 6, 0 = dimanche)
│ │ │ │ │
│ │ │ │ │
* * * * *

Exemples :
0 18 * * *   →  Tous les jours à 18h
0 9,18 * * * →  Tous les jours à 9h et 18h
0 10 * * 1   →  Tous les lundis à 10h
```

---

## 📊 SUIVRE LES RÉSERVATIONS

### Accéder au Dashboard Supabase

1. **URL** : [supabase.com/dashboard](https://supabase.com/dashboard)
2. Se connecter
3. Sélectionner votre projet "Voyage Mystère"

### Voir toutes les réservations

1. Sidebar → **"Table Editor"**
2. Cliquez sur la table **"bookings"**
3. Vous voyez toutes les réservations avec :
   - N° de réservation (VM-2024-06-1842)
   - Email du client
   - Thématique
   - Dates
   - Prix
   - Statut (confirmed, cancelled, completed)
   - Date de création

### Rechercher une réservation spécifique

**Par email :**
1. Dans la table "bookings"
2. En haut à droite, champ "Filter"
3. `user_id` → `is` → (collez l'email)

**Par numéro :**
1. Filter → `booking_number` → `equals` → VM-2024-06-1842

### Modifier manuellement une réservation

**⚠️ À utiliser avec précaution !**

1. Table "bookings" → Cliquez sur la ligne à modifier
2. Double-cliquez sur la cellule à modifier (ex: dates, prix)
3. Changez la valeur
4. Appuyez sur **Entrée**
5. Sauvegarde automatique

**Cas d'usage :**
- Corriger une faute de frappe dans un nom
- Modifier les dates à la demande du client
- Ajouter une option oubliée

---

## 📈 ANALYTICS & PERFORMANCE

### Google Analytics 4

**Accéder aux stats :**

1. [analytics.google.com](https://analytics.google.com)
2. Sélectionner "Voyage Mystère"

**Rapports utiles :**

📊 **Acquisition**
- D'où viennent vos visiteurs ? (Organic Search, Social, Direct...)

📊 **Engagement**
- Pages les plus vues
- Temps moyen sur le site
- Taux de rebond

📊 **Conversions**
- Nombre de réservations (événement `purchase`)
- Revenue total
- Taux de conversion par source

📊 **Funnel de réservation**
- Combien de personnes à chaque étape :
  1. Visite homepage
  2. Clique "Réserver"
  3. Sélectionne thème
  4. Complète questionnaire
  5. Arrive au paiement
  6. Paie

→ Identifiez où les gens abandonnent !

### Microsoft Clarity (Heatmaps)

1. [clarity.microsoft.com](https://clarity.microsoft.com)
2. Sélectionner "Voyage Mystère"

**Fonctionnalités :**

🔥 **Heatmaps**
- Voir où les gens cliquent sur la homepage
- Zones chaudes = zones d'intérêt
- Zones froides = zones ignorées

📹 **Session Recordings**
- Regarder des enregistrements de visites réelles
- Voir où les gens galèrent
- Identifier les bugs UX

💡 **Insights**
- "45% des utilisateurs cliquent sur X mais ça ne fait rien"
  → Bug à corriger !

### Monitorer les performances (Lighthouse)

**Vérifier le score de votre site :**

1. Ouvrir Chrome
2. Aller sur votre site
3. F12 (DevTools)
4. Onglet **"Lighthouse"**
5. **"Analyze page load"**

Vous obtenez 4 scores /100 :
- ⚡ **Performance** (vitesse) → Objectif > 95
- ♿ **Accessibility** (accessibilité) → Objectif 100
- ✅ **Best Practices** → Objectif 100
- 🔍 **SEO** → Objectif 100

**Si score < 90 :**
- Images trop lourdes → Compresser via Cloudinary
- Scripts bloquants → Contacter dev
- Manque balises meta → Vérifier Sanity

---

## ❓ FAQ MAINTENANCE

### Q: J'ai modifié du texte dans Sanity mais ça n'apparaît pas sur le site ?

**A:** 3 possibilités :

1. **Vous n'avez pas "Publish"**
   → En haut à droite de Sanity, cliquez "Publish"

2. **Le cache n'est pas vidé**
   → Attendez 2-3 minutes (Next.js revalidate)
   → Ou forcez : Ctrl+Shift+R (vider cache navigateur)

3. **Erreur de build**
   → Allez sur Vercel Dashboard → "Deployments"
   → Vérifiez que le dernier déploiement est vert ✅
   → Si rouge ❌, contactez dev

---

### Q: Je veux changer la couleur du site (ex: bleu → vert)

**A:** Ça nécessite des modifications CSS.

**Fichier à modifier :** `/tailwind.config.ts`

```typescript
// Cherchez :
colors: {
  primary: {
    500: '#3B82F6',  // <-- Bleu actuel
  }
}

// Changez en :
colors: {
  primary: {
    500: '#10B981',  // <-- Vert
  }
}
```

Ensuite commit & push → Redéploiement auto.

**⚠️ MAIS** : Il faut aussi modifier toutes les nuances (50, 100, 200... 900).
→ Utilisez un générateur : [uicolors.app](https://uicolors.app/create)

---

### Q: Comment ajouter une nouvelle question au questionnaire ?

**A:** Ça nécessite du code.

**Fichier à modifier :** `/components/booking/questionnaire/questions.ts`

Exemple pour ajouter "Préférez-vous la mer ou la montagne ?" :

```typescript
{
  id: 16,  // Nouveau numéro
  type: 'radio',
  question: 'Préférez-vous la mer ou la montagne ?',
  options: [
    { value: 'mer', label: 'Mer (plages, côtes, océan)' },
    { value: 'montagne', label: 'Montagne (sommets, lacs, forêts)' },
    { value: 'both', label: 'Les deux, j\'adore tout !' },
  ],
}
```

Puis commit & push.

---

### Q: Un client me contacte pour modifier ses dates, comment faire ?

**A:**

**Option 1 : Le client le fait lui-même**
→ Donnez-lui le lien de son Espace Client
→ "Ma réservation" → "Modifier mes dates"
→ S'il est à plus de 30 jours, c'est gratuit

**Option 2 : Vous le faites manuellement**

1. Supabase → Table "bookings"
2. Trouvez la réservation (par email ou booking_number)
3. Double-cliquez sur `start_date` et `end_date`
4. Changez les dates (format : YYYY-MM-DD, ex: 2024-07-15)
5. Sauvegarde auto

**Puis :**
- Envoyez un email au client pour confirmer
- Si frais de modification (< 30 jours), créez une invoice Stripe manuelle

---

### Q: Comment voir combien j'ai gagné ce mois-ci ?

**A:**

**Option 1 : Stripe Dashboard**

1. [dashboard.stripe.com](https://dashboard.stripe.com)
2. Voir le graphique "Revenus" (Revenue)
3. Filtrer par période (ce mois, ce trimestre...)

**Option 2 : Supabase (requête SQL)**

1. Supabase → "SQL Editor"
2. Nouvelle requête :

```sql
SELECT
  COUNT(*) as nombre_ventes,
  SUM(total_price) as total_ca
FROM bookings
WHERE
  status = 'confirmed'
  AND created_at >= '2024-11-01'  -- Début du mois
  AND created_at < '2024-12-01'   -- Fin du mois
```

3. Run → Vous voyez le nombre de ventes et le CA total

---

### Q: Le site est lent, que faire ?

**A:**

**Checklist rapide :**

1. **Testez votre connexion internet**
   → speedtest.net (si < 10 Mbps, c'est peut-être vous)

2. **Vérifiez le status Vercel**
   → [vercel-status.com](https://www.vercel-status.com/)
   → Si incidents, attendez

3. **Lighthouse test**
   → F12 → Lighthouse → Analyze
   → Si Performance < 80 :
     - Images trop lourdes ? (compressez)
     - Vidéos non optimisées ?

4. **Contactez le dev** si ça persiste

---

### Q: J'ai supprimé quelque chose par erreur dans Sanity, comment récupérer ?

**A:**

✅ **Bonne nouvelle : Sanity garde un historique !**

1. Dans Sanity Studio, allez sur le document supprimé (si vous retrouvez son URL)
2. Menu `⋯` → **"Revision History"**
3. Vous voyez toutes les versions
4. Sélectionnez une version antérieure
5. **"Restore this version"**

**Si vraiment perdu :**
→ Contactez le dev, on a des backups Supabase quotidiens

---

### Q: Comment créer un code promo ?

**A:**

**Via Stripe (recommandé) :**

1. Stripe Dashboard → **"Products" → "Coupons"**
2. **"Create coupon"**
3. Remplissez :
   ```
   ID : BIENVENUE10
   Type : Percentage discount
   Value : 10%
   Duration : Once
   ```
4. Save

5. Les clients peuvent utiliser `BIENVENUE10` au moment de la réservation

**Codes promos courants à créer :**
- `BIENVENUE10` : -10% première réservation
- `PARRAINAGE50` : -50€ si parrainé
- `NOEL20` : -20% pour Noël
- `FLASH100` : -100€ (ventes flash ponctuelles)

---

### Q: Comment sauvegarder le site / faire un backup ?

**A:**

**Automatique :**
- ✅ Supabase fait des backups quotidiens (7 jours)
- ✅ Vercel garde l'historique des déploiements
- ✅ Le code est sur GitHub (historique complet)

**Manuel (recommandé 1x/mois) :**

1. **Exporter la base de données Supabase :**
   - Supabase Dashboard → "Settings" → "Database"
   - "Backup" → "Create backup"
   - Téléchargez le fichier .sql

2. **Exporter le contenu Sanity :**
   ```bash
   sanity dataset export production backup.tar.gz
   ```

3. **Sauvegarder les images Cloudinary :**
   - Cloudinary Dashboard → "Media Library"
   - Sélectionner tout → "Export"

**Stockage des backups :**
→ Google Drive, Dropbox, ou disque dur externe

---

## 📞 QUAND CONTACTER UN DÉVELOPPEUR ?

**Contactez un dev si :**

❌ Le site est down (erreur 500, page blanche)
❌ Les paiements Stripe ne fonctionnent plus
❌ Les emails automatiques ne partent plus
❌ Vous voulez ajouter une fonctionnalité majeure (nouveau tunnel, nouvel onglet...)
❌ Vous voulez changer complètement le design
❌ Problème de sécurité (faille détectée, hack...)
❌ Migration (changer de serveur, nouveau domaine...)

**Vous pouvez gérer seul·e :**

✅ Modifier les textes (Sanity)
✅ Ajouter des images (Cloudinary + Sanity)
✅ Créer des articles de blog (Sanity)
✅ Gérer les témoignages (Sanity)
✅ Modifier les prix (Sanity)
✅ Suivre les réservations (Supabase)
✅ Créer des codes promos (Stripe)
✅ Voir les analytics (GA4, Clarity)

---

## 🎓 RESSOURCES UTILES

**Tutoriels Sanity :**
- [sanity.io/docs](https://www.sanity.io/docs)
- Vidéo : "Sanity CMS Basics" (YouTube)

**Tutoriels Stripe :**
- [stripe.com/docs](https://stripe.com/docs)
- Dashboard Stripe a des guides intégrés

**Google Analytics :**
- [support.google.com/analytics](https://support.google.com/analytics)

**Lighthouse (Performance) :**
- [web.dev/measure](https://web.dev/measure/)

**Communauté :**
- Groupe Facebook/Slack des utilisateurs (si existant)
- Email support : dev@voyagemystere.com

---

**Vous êtes maintenant prêt·e à gérer votre site comme un·e pro ! 🚀**

*Document mis à jour le 09/11/2024 • Version 1.0*
