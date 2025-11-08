#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Config Loader - Charge et valide la configuration du bot LinkedIn
Supporte les variables d'environnement avec ${VAR}
"""

import json
import os
import re
from pathlib import Path
from typing import Any, Dict


class ConfigLoader:
    """Charge et gère la configuration du bot depuis config.json et .env"""

    def __init__(self, config_path='config.json', env_path='.env'):
        """
        Initialise le chargeur de configuration

        Args:
            config_path: Chemin vers le fichier config.json
            env_path: Chemin vers le fichier .env
        """
        self.config_path = Path(config_path)
        self.env_path = Path(env_path)
        self.env_vars = {}
        self._raw_config = {}
        self.config = {}

        # Charger dans l'ordre
        self._load_env_file()
        self._load_config_file()
        self._expand_env_variables()
        self._apply_mappings()

    def _load_env_file(self):
        """Charge les variables d'environnement depuis .env"""
        # D'abord les variables système
        self.env_vars = dict(os.environ)

        # Ensuite le fichier .env (prioritaire)
        if self.env_path.exists():
            print(f"📄 Chargement des variables d'environnement depuis {self.env_path}")
            with open(self.env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    # Ignorer les commentaires et lignes vides
                    if not line or line.startswith('#'):
                        continue

                    # Parser KEY=VALUE
                    if '=' in line:
                        key, value = line.split('=', 1)
                        key = key.strip()
                        value = value.strip()

                        # Enlever les quotes si présentes
                        if value.startswith('"') and value.endswith('"'):
                            value = value[1:-1]
                        elif value.startswith("'") and value.endswith("'"):
                            value = value[1:-1]

                        self.env_vars[key] = value
        else:
            print(f"⚠️  Fichier {self.env_path} non trouvé - utilisation des variables système uniquement")

    def _load_config_file(self):
        """Charge le fichier config.json"""
        if not self.config_path.exists():
            raise FileNotFoundError(
                f"❌ Fichier de configuration {self.config_path} non trouvé!\n"
                f"   Créez un fichier config.json ou utilisez config_example.py"
            )

        print(f"📄 Chargement de la configuration depuis {self.config_path}")
        with open(self.config_path, 'r', encoding='utf-8') as f:
            self._raw_config = json.load(f)

        # Copie pour manipulation
        self.config = self._raw_config.copy()

    def _expand_env_variables(self):
        """Remplace les ${VAR} par leurs valeurs depuis l'environnement"""
        self.config = self._expand_dict(self.config)

    def _expand_dict(self, obj):
        """Récursivement remplace les variables d'environnement dans un dict/list"""
        if isinstance(obj, dict):
            return {k: self._expand_dict(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._expand_dict(item) for item in obj]
        elif isinstance(obj, str):
            return self._expand_string(obj)
        else:
            return obj

    def _expand_string(self, value: str) -> str:
        """
        Remplace ${VAR} ou $VAR par la valeur de la variable d'environnement

        Args:
            value: Chaîne pouvant contenir des références à des variables

        Returns:
            Chaîne avec variables remplacées
        """
        # Pattern pour ${VAR} ou $VAR
        pattern = r'\$\{([^}]+)\}|\$([A-Z_][A-Z0-9_]*)'

        def replacer(match):
            var_name = match.group(1) or match.group(2)
            env_value = self.env_vars.get(var_name)

            if env_value is None:
                # Variable non trouvée - laisser tel quel ou warning
                print(f"⚠️  Variable d'environnement ${{{var_name}}} non définie")
                return match.group(0)  # Garder ${VAR} original

            return env_value

        return re.sub(pattern, replacer, value)

    def _apply_mappings(self):
        """
        Applique les mappings définis dans la config aux valeurs françaises
        Convertit les valeurs lisibles en codes LinkedIn
        """
        if 'mappings' not in self.config:
            return

        mappings = self.config['mappings']

        # Mapper les niveaux d'expérience
        if 'niveau_experience' in mappings and 'filtres' in self.config:
            niveaux = self.config['filtres'].get('niveau_experience', [])
            if isinstance(niveaux, list):
                codes = []
                for niveau in niveaux:
                    code = self._find_in_mapping(mappings['niveau_experience'], niveau)
                    if code:
                        codes.append(code)
                # Stocker les codes ET garder les originaux
                self.config['filtres']['_niveau_experience_codes'] = codes

    def _find_in_mapping(self, mapping: Dict[str, str], key: str) -> str:
        """
        Recherche une valeur dans un mapping (case-insensitive)

        Args:
            mapping: Dictionnaire de mapping
            key: Clé à rechercher

        Returns:
            Valeur mappée ou None
        """
        if not key:
            return None

        # Essai exact
        if key in mapping:
            return mapping[key]

        # Essai case-insensitive
        key_lower = key.lower()
        for map_key, map_value in mapping.items():
            if map_key.lower() == key_lower:
                return map_value

        return None

    def get(self, *keys, default=None):
        """
        Récupère une valeur de configuration avec notation pointée

        Args:
            *keys: Clés imbriquées (ex: get('recherche', 'mots_cles'))
            default: Valeur par défaut si non trouvée

        Returns:
            Valeur de configuration ou default
        """
        value = self.config
        for key in keys:
            if isinstance(value, dict) and key in value:
                value = value[key]
            else:
                return default
        return value

    def get_email(self):
        """Récupère l'email LinkedIn"""
        return self.get('credentials', 'email', default='')

    def get_password(self):
        """Récupère le mot de passe LinkedIn"""
        return self.get('credentials', 'password', default='')

    def get_locations(self):
        """Récupère la liste des localisations"""
        return self.get('recherche', 'localisations', default=[])

    def get_keywords(self):
        """Récupère la liste des mots-clés"""
        return self.get('recherche', 'mots_cles', default=[])

    def get_experience_levels(self):
        """Récupère les niveaux d'expérience"""
        return self.get('filtres', 'niveau_experience', default=[])

    def get_job_types(self):
        """Récupère les types d'emploi"""
        return self.get('filtres', 'type_emploi', default=[])

    def get_remote_types(self):
        """Récupère les modes de travail"""
        mode = self.get('filtres', 'mode_travail', default=[])
        # Si c'est une string, convertir en liste
        if isinstance(mode, str):
            return [mode] if mode else []
        return mode

    def get_date_posted(self):
        """Récupère la date de publication"""
        return self.get('filtres', 'date_publication', default='Any Time')

    def get_salary(self):
        """Récupère le salaire minimum"""
        return self.get('filtres', 'salaire_minimum', default='')

    def get_sort(self):
        """Récupère le tri"""
        return self.get('filtres', 'tri', default='Recent')

    def get_blacklist_companies(self):
        """Récupère la liste noire des entreprises"""
        return self.get('listes_noires', 'entreprises', default=[])

    def get_blacklist_titles(self):
        """Récupère la liste noire des titres"""
        return self.get('listes_noires', 'titres_mots_cles', default=[])

    def get_preferred_cv(self):
        """Récupère le numéro de CV préféré"""
        return self.get('comportement', 'cv_prefere', default=1)

    def get_follow_companies(self):
        """Vérifie si on doit suivre les entreprises"""
        return self.get('comportement', 'suivre_entreprises', default=False)

    def is_headless(self):
        """Vérifie si mode headless"""
        return self.get('navigateur', 'mode_headless', default=False)

    def get_chrome_profile(self):
        """Récupère le chemin du profil Chrome"""
        return self.get('navigateur', 'profil_chrome', default='')

    def is_debug(self):
        """Vérifie si mode debug"""
        return self.get('sortie', 'mode_debug', default=False)

    def get_display_warnings(self):
        """Vérifie si on affiche les warnings"""
        return self.get('sortie', 'afficher_avertissements', default=False)

    def get_max_applications_per_day(self):
        """Récupère la limite quotidienne de candidatures"""
        return self.get('limites_securite', 'max_candidatures_par_jour', default=100)

    def get_delay_between_applications(self):
        """Récupère le délai entre candidatures [min, max]"""
        delay = self.get('limites_securite', 'delai_entre_candidatures_sec', default=[3, 8])
        if isinstance(delay, list) and len(delay) == 2:
            return tuple(delay)
        return (3, 8)

    def validate(self):
        """
        Valide la configuration et affiche des warnings si nécessaire

        Returns:
            bool: True si configuration valide
        """
        warnings = []
        errors = []

        # Vérifier les credentials
        email = self.get_email()
        password = self.get_password()

        if not email or '${' in email or '@exemple.com' in email:
            errors.append("❌ Email LinkedIn non configuré ou invalide")

        if not password or '${' in password or password == 'VotreMotDePasse':
            errors.append("❌ Mot de passe LinkedIn non configuré ou invalide")

        # Vérifier les paramètres de recherche
        if not self.get_keywords():
            warnings.append("⚠️  Aucun mot-clé de recherche défini")

        if not self.get_locations():
            warnings.append("⚠️  Aucune localisation définie")

        # Afficher les warnings et erreurs
        if warnings:
            print("\n⚠️  AVERTISSEMENTS:")
            for w in warnings:
                print(f"   {w}")

        if errors:
            print("\n❌ ERREURS DE CONFIGURATION:")
            for e in errors:
                print(f"   {e}")
            print("\n💡 Assurez-vous d'avoir:")
            print("   1. Créé un fichier .env avec vos identifiants (voir .env.example)")
            print("   2. Ou rempli directement config.json avec vos informations")
            return False

        print("\n✅ Configuration valide!")
        return True

    def print_summary(self):
        """Affiche un résumé de la configuration"""
        print("\n" + "=" * 80)
        print("RÉSUMÉ DE LA CONFIGURATION")
        print("=" * 80)
        print(f"\n📧 Email: {self.get_email()}")
        print(f"📍 Localisations: {', '.join(self.get_locations()[:3])}{'...' if len(self.get_locations()) > 3 else ''}")
        print(f"🔍 Mots-clés: {', '.join(self.get_keywords()[:3])}{'...' if len(self.get_keywords()) > 3 else ''}")
        print(f"💼 Types d'emploi: {', '.join(self.get_job_types())}")
        print(f"📊 Niveau: {', '.join(self.get_experience_levels())}")
        print(f"🏠 Mode travail: {', '.join(self.get_remote_types())}")
        print(f"📅 Date publication: {self.get_date_posted()}")
        print(f"💰 Salaire min: {self.get_salary()}")
        print(f"\n🛡️  Limites sécurité:")
        print(f"   • Max candidatures/jour: {self.get_max_applications_per_day()}")
        delay = self.get_delay_between_applications()
        print(f"   • Délai entre candidatures: {delay[0]}-{delay[1]}s")
        print(f"\n🌐 Navigateur: {'Headless' if self.is_headless() else 'Visible'}")
        print(f"🐛 Debug: {'Activé' if self.is_debug() else 'Désactivé'}")
        print("=" * 80)


# Fonction helper pour usage direct
def load_config(config_path='config.json', env_path='.env'):
    """
    Charge la configuration et retourne un objet ConfigLoader

    Args:
        config_path: Chemin vers config.json
        env_path: Chemin vers .env

    Returns:
        ConfigLoader instance
    """
    loader = ConfigLoader(config_path, env_path)

    if not loader.validate():
        raise ValueError("Configuration invalide - corrigez les erreurs ci-dessus")

    loader.print_summary()
    return loader


# Test si exécuté directement
if __name__ == "__main__":
    try:
        config = load_config()
        print("\n✅ Test de chargement réussi!")
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
