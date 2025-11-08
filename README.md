# 🤖 LinkedIn Auto-Apply Bot v2.0

Bot automatisé pour postuler aux offres d'emploi LinkedIn via "Postuler facilement" (Easy Apply).

**Version 2.0** - Refonte complète avec Firefox, Ollama IA, et configuration YAML.

---

## ✨ Nouveautés v2.0

- 🦊 **Support Firefox** (préféré) avec fallback Chrome automatique
- 🤖 **IA Locale Ollama** pour répondre aux questions de recrutement
- ⚙️ **Configuration YAML** centralisée et validée par schéma JSON
- 🔒 **Sécurité renforcée** avec variables d'environnement (.env)
- 📊 **Export JSON** complet (avant/après candidature)
- 🧪 **Tests unitaires** et intégration CI
- 🗑️ **Code nettoyé** - Suppression blacklist/whitelist

---

## 📋 Prérequis

- **Python 3.10+**
- **Firefox** (recommandé) ou **Google Chrome**
- **Ollama** (optionnel, pour IA) : https://ollama.ai
- **Compte LinkedIn** actif

---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <VOTRE_REPO>
cd LinkedinBot
git checkout feat/configurable-linkedin-autoapply
```

### 2. Installer les dépendances

```bash
# Avec Make
make install

# Ou directement
pip install -r requirements.txt
```

### 3. Configurer les identifiants

```bash
# Copier le template
cp .env.example .env

# Éditer avec vos identifiants LinkedIn
nano .env
```

Contenu de `.env` :
```bash
LINKEDIN_EMAIL=votre.email@exemple.com
LINKEDIN_PASSWORD=VotreMotDePasse123!
```

### 4. Configurer les préférences

Éditez `config.yaml` ou copiez un exemple :

```bash
cp configs/minimal.config.yaml config.yaml
nano config.yaml
```

### 5. (Optionnel) Installer Ollama pour l'IA

```bash
# Installation Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Télécharger un modèle
ollama pull llama3.1:8b

# Vérifier
make check-ollama
```

---

## 🎯 Utilisation

### Lancement simple

```bash
# Avec Make
make run

# Ou directement
python src/main.py
```

### Mode dry-run (simulation)

```bash
make run-dry
```

Ou éditez `config.yaml` :
```yaml
safety:
  dry_run: true  # Simulation sans envoi réel
```

### Valider la configuration

```bash
make validate-config
```

---

## ⚙️ Configuration Détaillée

### Structure de `config.yaml`

```yaml
auth:
  linkedin_email: "${LINKEDIN_EMAIL}"  # Variable d'environnement
  linkedin_password: "${LINKEDIN_PASSWORD}"
  profile_choice:
    browser: "firefox"  # "firefox" ou "chrome"
    firefox_profile_path: null  # Chemin vers profil Firefox (optionnel)

search:
  keywords:
    - "stage informatique"
    - "cybersécurité"
  locations:
    - "Île-de-France"
    - "Paris"
  contract_types:  # internship, fixed-term, permanent, apprenticeship...
    - "internship"
  seniority_levels:  # internship, entry, associate, mid-senior...
    - "internship"
    - "entry"
  work_modes:  # on-site, hybrid, remote
    - "hybrid"
    - "remote"
  date_posted: "past_24_hours"  # past_24_hours, past_week, past_month, any
  sort_by: "date"  # date ou relevance
  easy_apply_only: true
  pages_to_scan: 5

apply:
  max_applications_per_day: 40
  max_applications_total: 200
  delay_between_applications_seconds: [8, 20]  # Délai aléatoire min/max
  timeout_seconds: 60
  forbidden_hours:  # Plages à éviter
    - { start: "00:00", end: "06:00" }
  message_to_recruiter: |
    Bonjour, je suis très intéressé...
  ai_answers:
    enable: true
    provider: "ollama"
    model: "llama3.1:8b"
    ollama_base_url: "http://localhost:11434"

logging:
  output_dir: "runs"
  save_json_applied: true
  json_filename: "applications_log.json"
  save_screenshots_on_error: true
  log_level: "INFO"  # DEBUG, INFO, WARNING, ERROR

safety:
  dry_run: false  # Mode simulation
  show_browser: true  # false = headless
```

### Mappings des filtres

Le bot convertit automatiquement les valeurs lisibles en codes LinkedIn :

**Types de contrat** :
- `internship` → Stage
- `apprenticeship` → Alternance
- `permanent` → CDI
- `fixed-term` → CDD
- `part-time` → Temps partiel

**Niveaux d'expérience** :
- `internship` → Stage
- `entry` → Débutant
- `associate` → Intermédiaire
- `mid-senior` → Confirmé

**Modes de travail** :
- `on-site` → Sur place
- `hybrid` → Hybride
- `remote` → Télétravail

---

## 📊 Export JSON

Le bot exporte automatiquement toutes les candidatures dans `runs/applications_log.json` :

```json
[
  {
    "timestamp": "2025-01-08T10:30:00",
    "job_id": "12345",
    "title": "Stage Développeur",
    "company": "TechCorp",
    "location": "Paris",
    "link": "https://linkedin.com/jobs/view/12345",
    "easy_apply": true,
    "filters_snapshot": { "keywords": [...], ... },
    "status": "applied",  // queued, applied, failed
    "notes": null,
    "screenshot_path": null
  }
]
```

**Statuts** :
- `queued` : En attente avant tentative
- `applied` : Candidature envoyée avec succès
- `failed` : Échec de la candidature

---

## 🧪 Tests

```bash
# Tous les tests
make test

# Tests avec couverture
pytest tests/ -v --cov=src --cov-report=html

# Test de configuration uniquement
make test-config
```

---

## 🛠️ Développement

### Linting et formatage

```bash
# Vérifier le code
make lint

# Formater automatiquement
make format
```

### Structure du projet

```
LinkedinBot/
├── config.yaml              # Configuration principale
├── config_schema.json       # Validation JSON Schema
├── .env                     # Secrets (NON committé)
├── .env.example             # Template
├── requirements.txt         # Dépendances
├── Makefile                 # Commandes utiles
├── src/
│   ├── __init__.py
│   ├── main.py              # Point d'entrée
│   ├── config_manager.py    # Gestion config
│   ├── browser_manager.py   # Firefox/Chrome
│   ├── linkedin_filters.py  # Mappings filtres
│   ├── ollama_client.py     # Client IA
│   └── logger_manager.py    # Logs et JSON
├── tests/
│   └── test_*.py            # Tests unitaires
├── configs/
│   └── minimal.config.yaml  # Exemple minimal
└── runs/
    ├── applications_log.json
    ├── bot.log
    └── screenshots/
```

---

## 🔧 Dépannage

### Problème : "Variable d'environnement non définie"

**Solution** : Vérifiez que `.env` existe et contient `LINKEDIN_EMAIL` et `LINKEDIN_PASSWORD`.

```bash
cp .env.example .env
nano .env
```

### Problème : "Firefox non disponible"

**Solution** : Le bot basculera automatiquement vers Chrome. Pour forcer Chrome :

```yaml
auth:
  profile_choice:
    browser: "chrome"
```

### Problème : "Ollama non accessible"

**Solution** :
1. Vérifiez qu'Ollama est lancé : `ollama serve`
2. Vérifiez le modèle : `ollama list`
3. Téléchargez si absent : `ollama pull llama3.1:8b`
4. Ou désactivez l'IA :

```yaml
apply:
  ai_answers:
    enable: false
```

### Problème : "Configuration invalide"

**Solution** : Validez votre config :

```bash
make validate-config
```

---

## 📈 Bonnes Pratiques

### 1. Démarrage progressif

**Jour 1** :
```yaml
apply:
  max_applications_per_day: 10
  dry_run: true  # Simulation
```

**Semaine 2** :
```yaml
apply:
  max_applications_per_day: 30
  dry_run: false  # Réel
```

### 2. Mots-clés efficaces

❌ **Trop large** : `"informatique"`, `"développeur"`
✅ **Ciblé** : `"stage développeur Python"`, `"alternance cybersécurité"`

### 3. Limites recommandées

- **Max 150-200 candidatures/jour** (risque de blocage au-delà)
- **Délai min 8 secondes** entre candidatures
- **Activer forbidden_hours** (éviter la nuit)

---

## 🔒 Sécurité

### Ce qui est protégé

- ✅ Identifiants dans `.env` (non committé)
- ✅ `.gitignore` configuré
- ✅ Variables d'environnement supportées
- ✅ Validation de configuration

### À NE JAMAIS FAIRE

- ❌ Commiter `.env` ou `config.yaml` avec vrais identifiants
- ❌ Dépasser 200 candidatures/jour (risque de ban)
- ❌ Utiliser des identifiants partagés

---

## 📜 Licence

Projet open-source sous licence MIT.

---

## 🙏 Crédits

- **Version 2.0** : Refonte complète avec Firefox, Ollama, YAML
- **Base originale** : wodsuz/EasyApplyJobsBot

---

## ⚖️ Avertissement

⚠️ **Utilisation à vos risques**

- Ce bot est à usage éducatif et personnel
- L'utilisation intensive peut entraîner un bannissement LinkedIn
- Respectez les ToS de LinkedIn
- Les auteurs ne sont pas responsables d'une utilisation abusive

**Utilisez avec modération (< 200 candidatures/jour).**

---

**Bonne chance dans votre recherche d'emploi ! 🍀**
