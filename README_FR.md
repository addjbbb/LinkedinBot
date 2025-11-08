# 🤖 Bot LinkedIn Easy Apply - Version Améliorée

Bot automatisé pour postuler aux offres d'emploi LinkedIn via "Postuler facilement" (Easy Apply).

**Version 2.0** - Nouvelle architecture avec configuration JSON et sécurité renforcée.

---

## 🆕 Nouveautés Version 2.0

### ✨ Améliorations Majeures

1. **Configuration JSON moderne**
   - Fichier `config.json` central avec tous les paramètres
   - Commentaires intégrés pour chaque option
   - Support des variables d'environnement `${VAR}`

2. **Sécurité renforcée**
   - Fichier `.env` pour les identifiants (jamais committé)
   - `.gitignore` automatique pour protéger vos secrets
   - Mappings intelligents français/anglais

3. **Robustesse inspirée des scrapers professionnels**
   - Sélecteurs multiples pour chaque élément
   - Gestion d'erreurs avancée
   - Délais aléatoires réalistes (anti-détection)

4. **Système de limites intelligentes**
   - Max candidatures/jour configurable
   - Pauses automatiques
   - Heures interdites (nuit)
   - Pause déjeuner

5. **Statistiques détaillées**
   - Suivi en temps réel
   - Taux de réussite
   - Top entreprises

---

## 📋 Prérequis

- **Python 3.7+**
- **Google Chrome** (navigateur)
- **Compte LinkedIn** actif

---

## 🚀 Installation Rapide

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/LinkedinBot
cd LinkedinBot
```

### 2. Installer les dépendances

```bash
pip3 install -r requirements.yaml
```

Les dépendances incluent :
- `selenium` - Automatisation navigateur
- `webdriver-manager` - Gestion automatique du driver Chrome
- `python-dotenv` - Variables d'environnement (optionnel mais recommandé)

### 3. Configurer vos identifiants

**Méthode recommandée** (avec `.env`) :

```bash
# Copier l'exemple
cp .env.example .env

# Éditer avec vos identifiants
nano .env  # ou vim, code, etc.
```

Contenu de `.env` :
```bash
LINKEDIN_EMAIL=votre.email@exemple.com
LINKEDIN_PASSWORD=VotreMotDePasse123
```

**Méthode alternative** (directement dans config.json) :

Éditez `config.json` section `credentials` :
```json
"credentials": {
  "email": "votre.email@exemple.com",
  "password": "VotreMotDePasse123"
}
```

⚠️ **ATTENTION** : Avec cette méthode, ne commitez JAMAIS config.json !

### 4. Configurer vos préférences

Éditez `config.json` pour personnaliser :

```json
{
  "recherche": {
    "localisations": ["Paris, France", "Remote"],
    "mots_cles": ["développeur python", "data scientist"],
    "distance_km": "25"
  },
  "filtres": {
    "niveau_experience": ["Entry level", "Associate"],
    "type_emploi": ["Full-time", "Contract"],
    "mode_travail": ["Remote", "Hybrid"],
    "date_publication": "Past Week"
  }
}
```

### 5. Lancer le bot

```bash
python3 linkedin.py
```

Ou avec l'ancien système (config.py) :
```bash
python3 linkedin.py --legacy
```

---

## 📖 Guide de Configuration Détaillé

### Structure du config.json

Le fichier est divisé en sections :

#### 1. **credentials** - Identifiants
```json
"credentials": {
  "email": "${LINKEDIN_EMAIL}",
  "password": "${LINKEDIN_PASSWORD}"
}
```
- Utilisez `${VAR}` pour référencer une variable `.env`
- Ou écrivez directement (non recommandé)

#### 2. **recherche** - Paramètres de recherche
```json
"recherche": {
  "localisations": ["Paris, France", "Remote"],
  "mots_cles": ["react developer", "frontend"],
  "distance_km": "25"
}
```

**Options de localisation** :
- Ville : `"Paris, France"`, `"Lyon, France"`
- Pays : `"France"`, `"United States"`
- Continent : `"Europe"`, `"NorthAmerica"`, `"Asia"`
- Remote : `"Remote"`

**Distance** : `"0"`, `"10"`, `"25"`, `"50"`, `"100"` (km)

#### 3. **filtres** - Filtres de recherche

```json
"filtres": {
  "niveau_experience": ["Entry level"],
  "type_emploi": ["Full-time", "Contract"],
  "mode_travail": ["Remote", "Hybrid"],
  "date_publication": "Past Week",
  "salaire_minimum": "$60,000+",
  "tri": "Recent",
  "easy_apply_uniquement": true
}
```

**Niveaux d'expérience** :
- `Internship` / `Stage`
- `Entry level` / `Débutant`
- `Associate` / `Intermédiaire`
- `Mid-Senior level` / `Confirmé` / `Senior`
- `Director` / `Directeur`
- `Executive` / `Cadre dirigeant`

**Types d'emploi** :
- `Full-time` / `Temps plein` / `CDI`
- `Part-time` / `Temps partiel`
- `Contract` / `CDD` / `Contrat`
- `Temporary` / `Freelance`
- `Internship` / `Stage` / `Alternance`
- `Volunteer` / `Bénévolat`

**Mode de travail** :
- `On-site` / `Sur place` / `Présentiel`
- `Hybrid` / `Hybride`
- `Remote` / `Télétravail` / `Distance`

**Date de publication** :
- `Past 24 hours` / `24h`
- `Past Week` / `Dernière semaine`
- `Past Month` / `Dernier mois`
- `Any Time` / `N'importe quand`

#### 4. **listes_noires** - Filtrage

```json
"listes_noires": {
  "entreprises": ["Entreprise A", "Entreprise B"],
  "titres_mots_cles": ["senior", "manager", ".Net"]
}
```

Le bot ignorera automatiquement :
- Les offres des entreprises listées
- Les offres contenant ces mots-clés dans le titre

#### 5. **limites_securite** - Anti-détection

```json
"limites_securite": {
  "max_candidatures_par_jour": 100,
  "max_candidatures_par_session": 50,
  "delai_entre_candidatures_sec": [3, 8],
  "pause_toutes_les_x_candidatures": 10,
  "heures_interdites": {
    "debut": 23,
    "fin": 7
  }
}
```

**Recommandations** :
- Ne pas dépasser 200 candidatures/jour
- Délai minimum 3 secondes entre candidatures
- Activer les pauses régulières
- Éviter de tourner la nuit (suspect)

#### 6. **navigateur** - Configuration Chrome

```json
"navigateur": {
  "type": "Chrome",
  "mode_headless": false,
  "profil_chrome": "/home/user/.config/google-chrome/Profile 1"
}
```

**Mode headless** :
- `false` : Navigateur visible (recommandé pour débuter)
- `true` : Navigateur invisible (arrière-plan)

**Profil Chrome** :
- Permet de rester connecté à LinkedIn
- Trouve le chemin : `chrome://version/` → "Profil"

---

## 🎯 Utilisation

### Lancement simple

```bash
python3 linkedin.py
```

### Options de ligne de commande

```bash
# Mode debug (affiche plus d'infos)
python3 linkedin.py --debug

# Utiliser l'ancien config.py
python3 linkedin.py --legacy

# Tester la configuration sans postuler
python3 config_loader.py
```

### Ce que fait le bot

1. **Connexion LinkedIn**
   - Utilise les cookies si disponibles
   - Sinon, se connecte avec email/password
   - Sauvegarde les cookies pour la prochaine fois

2. **Génération des URLs**
   - Crée toutes les combinaisons localisation × mot-clé
   - Applique tous les filtres configurés
   - Affiche les URLs générées

3. **Parcours des offres**
   - Visite chaque page de résultats (max 40 pages)
   - Pour chaque offre :
     - Vérifie si déjà postulé ✅
     - Vérifie si blacklistée 🚫
     - Cherche le bouton "Postuler facilement"
     - Remplit le formulaire
     - Sélectionne votre CV
     - Envoie la candidature 🎉

4. **Sauvegarde des résultats**
   - Fichier `data/Applied Jobs DATA - [DATE].txt`
   - Détails de chaque candidature
   - Statistiques finales

---

## 📊 Résultats et Suivi

### Fichiers générés

- **`data/Applied Jobs DATA - YYYYMMDD.txt`**
  - Liste de toutes les candidatures
  - Format : Numéro | Titre | Entreprise | Lieu | Résultat

- **`cookies/[hash].pkl`**
  - Cookies de session LinkedIn
  - Permet de ne pas se reconnecter

- **`data/urlData.txt`**
  - URLs de recherche générées
  - Utile pour débugger

### Exemple de résultat

```
---- Applied Jobs Data ---- created at: 20250108
---- Number | Job Title | Company | Location | Result

1 | Software Engineer | Tech Corp | Paris, France | * 🥳 Candidature envoyée
2 | Senior Dev | Big Co | Lyon, France | * 🤬 Emploi sur liste noire, ignoré!
3 | Frontend Dev | Startup | Remote | * 🥳 Candidature envoyée
4 | React Developer | Agency | Paris, France | * 🥳 Déjà postulé!

Catégorie: frontend, Paris postulé: 2 emplois sur 4.
```

### Statistiques affichées

```
📊 STATISTIQUES DE LA SESSION
================================================================================

⏱️  Durée: 15 minute(s)
👀 Offres visitées: 50
✅ Candidatures envoyées: 25
♻️  Déjà postulé: 10
🚫 Blacklistées: 5
❌ Échecs: 10
📈 Taux de réussite: 50.0%

🏢 Top 5 entreprises:
   1. Tech Startup: 5 candidature(s)
   2. Big Corp: 3 candidature(s)
   ...
```

---

## 🔧 Dépannage

### Problème : "Configuration invalide"

```bash
# Tester votre configuration
python3 config_loader.py
```

Vérifiez :
- Fichier `.env` existe et contient email/password
- Format JSON valide (pas de virgule en trop)
- Variables d'environnement bien définies

### Problème : "Couldn't log in LinkedIn"

**Solutions** :
1. Vérifiez email/password dans `.env`
2. Connectez-vous manuellement à LinkedIn une fois
3. Utilisez un profil Chrome existant :
   ```json
   "profil_chrome": "/path/to/chrome/profile"
   ```
4. Désactivez la double authentification LinkedIn (temporairement)

### Problème : "No resume selected"

**Solutions** :
1. Ajoutez au moins 1 CV sur votre profil LinkedIn
2. Allez sur LinkedIn → Moi → Paramètres → Confidentialité données → CV
3. Uploadez un PDF

### Problème : Bot trop lent

**Solutions** :
1. Réduire `delai_entre_candidatures_sec` (min 2s recommandé)
2. Augmenter `botSpeed` dans constants.py
3. Limiter le nombre de pages

### Problème : Bot détecté / Compte bloqué

**Prévention** :
1. Ne pas dépasser 150-200 candidatures/jour
2. Utiliser des délais réalistes (3-8 secondes)
3. Activer les pauses régulières
4. Ne pas tourner 24/7
5. Utiliser un profil Chrome réel

**Si bloqué** :
- Attendre 24-48h
- Vérifier votre compte LinkedIn (email de warning?)
- Réduire l'agressivité du bot

---

## 🎓 Astuces et Bonnes Pratiques

### 1. Démarrage progressif

**Jour 1** :
```json
"max_candidatures_par_jour": 20,
"delai_entre_candidatures_sec": [5, 10]
```

**Semaine 2** :
```json
"max_candidatures_par_jour": 50
```

**Après 1 mois** :
```json
"max_candidatures_par_jour": 100
```

### 2. Mots-clés efficaces

❌ **Trop large** : `"software"`, `"developer"`
✅ **Ciblé** : `"react developer"`, `"python backend"`

❌ **Trop de mots-clés** : 20+ mots-clés
✅ **Optimal** : 5-10 mots-clés bien choisis

### 3. Localisation intelligente

Si vous cherchez du remote :
```json
"localisations": ["Remote", "France"]
```

Si vous cherchez localement :
```json
"localisations": ["Paris, France"],
"distance_km": "25"
```

### 4. Blacklist stratégique

Ajoutez progressivement :
```json
"titres_mots_cles": [
  "senior",    // Si vous êtes junior
  "manager",   // Si vous ne voulez pas manager
  "lead",      // Si pas lead
  ".net"       // Technologies non maîtrisées
]
```

### 5. Suivre vos candidatures

Créez un fichier Excel avec :
- Date de candidature
- Entreprise
- Poste
- Statut (en attente / refus / entretien)
- Notes

---

## 🔒 Sécurité et Confidentialité

### Ce qui est sauvegardé localement

- **Cookies LinkedIn** : `cookies/[hash].pkl`
- **Résultats** : `data/Applied Jobs DATA - [DATE].txt`
- **Identifiants** : `.env` (si utilisé)

### Ce qui n'est JAMAIS partagé

- Vos identifiants LinkedIn
- Vos cookies de session
- Vos résultats de candidature

### Protection de vos identifiants

1. **Toujours** utiliser `.env` pour les identifiants
2. **Vérifier** que `.env` est dans `.gitignore`
3. **Ne jamais** commiter config.py avec vraies credentials
4. **Utiliser** config_example.py comme template

```bash
# Vérifier que .env n'est pas tracké
git status
# Ne devrait PAS montrer .env

# Si .env apparaît :
git rm --cached .env
echo ".env" >> .gitignore
```

---

## 📈 Fonctionnalités Pro (Payantes)

Le bot a une version gratuite (ce repo) et une version Pro.

### Fonctionnalités Pro

- ✅ Navigateur Firefox (en plus de Chrome)
- ✅ Réponses automatiques aux questions additionnelles
- ✅ IA pour remplir les formulaires complexes
- ✅ Filtres avancés (nb candidatures, taille entreprise, etc.)
- ✅ Message automatique au recruteur
- ✅ Export CSV/Excel des résultats
- ✅ Support multi-plateformes (AngelCo, GlobalLogic)

Plus d'infos : [www.automated-bots.com](https://www.automated-bots.com)

---

## 🐛 Signaler un Bug

Si vous rencontrez un problème :

1. Vérifier que ce n'est pas dans la section Dépannage
2. Activer le mode debug : `"mode_debug": true`
3. Créer une issue GitHub avec :
   - Description du problème
   - Logs (sans vos identifiants!)
   - Version Python (`python3 --version`)
   - OS (Windows/Mac/Linux)

---

## 🤝 Contribuer

Les contributions sont bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Projet open-source sous licence MIT.

Version gratuite modifiable et redistribuable en créditant les auteurs.

---

## 🙏 Crédits

- **Auteurs originaux** : [wodsuz/EasyApplyJobsBot](https://github.com/wodsuz/EasyApplyJobsBot)
- **Version 2.0** : Améliorations architecture, sécurité, et robustesse
- **Contributors** : Merci à tous les contributeurs !

---

## 📞 Support

- **Documentation** : Ce README + commentaires dans config.json
- **Issues GitHub** : Pour les bugs
- **Pro support** : help@automated-bots.com

---

## ⚖️ Avertissement

Ce bot est à usage éducatif et personnel uniquement.

- ⚠️ L'utilisation intensive peut entraîner un bannissement LinkedIn
- ⚠️ Utilisez avec modération (< 200 candidatures/jour)
- ⚠️ Les auteurs ne sont pas responsables d'une utilisation abusive
- ⚠️ Vérifiez les ToS de LinkedIn

**Utilisez à vos risques et périls.**

---

**Bonne chance dans votre recherche d'emploi ! 🍀**
