#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gestionnaire de configuration avec validation JSON Schema
Supporte les variables d'environnement et validation stricte
"""

import os
import re
import yaml
import json
import logging
from pathlib import Path
from typing import Any, Dict
from jsonschema import validate, ValidationError
from dotenv import load_dotenv

logger = logging.getLogger(__name__)


class ConfigManager:
    """Gestionnaire centralisé de configuration"""

    def __init__(self, config_path: str = "config.yaml", schema_path: str = "config_schema.json"):
        """
        Initialise le gestionnaire de configuration

        Args:
            config_path: Chemin vers le fichier YAML de configuration
            schema_path: Chemin vers le schéma JSON de validation
        """
        self.config_path = Path(config_path)
        self.schema_path = Path(schema_path)

        # Charger les variables d'environnement depuis .env
        load_dotenv()

        # Charger et valider la configuration
        self.raw_config = self._load_yaml()
        self.schema = self._load_schema()
        self.config = self._expand_env_variables(self.raw_config)
        self._validate_config()

        logger.info(f"✅ Configuration chargée depuis {self.config_path}")

    def _load_yaml(self) -> Dict[str, Any]:
        """Charge le fichier YAML"""
        if not self.config_path.exists():
            raise FileNotFoundError(
                f"❌ Fichier de configuration {self.config_path} non trouvé!\n"
                f"   Créez-le depuis configs/minimal.config.yaml"
            )

        with open(self.config_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)

    def _load_schema(self) -> Dict[str, Any]:
        """Charge le schéma JSON de validation"""
        if not self.schema_path.exists():
            logger.warning(f"⚠️  Schéma {self.schema_path} non trouvé, validation désactivée")
            return {}

        with open(self.schema_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _expand_env_variables(self, obj: Any) -> Any:
        """
        Remplace récursivement les ${VAR} par les valeurs d'environnement

        Args:
            obj: Objet (dict, list, str, etc.) à traiter

        Returns:
            Objet avec variables remplacées
        """
        if isinstance(obj, dict):
            return {k: self._expand_env_variables(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._expand_env_variables(item) for item in obj]
        elif isinstance(obj, str):
            return self._expand_string(obj)
        else:
            return obj

    def _expand_string(self, value: str) -> str:
        """
        Remplace ${VAR} ou $VAR par la valeur de la variable d'environnement

        Args:
            value: Chaîne pouvant contenir des références

        Returns:
            Chaîne avec variables remplacées
        """
        # Pattern pour ${VAR} ou $VAR
        pattern = r'\$\{([^}]+)\}|\$([A-Z_][A-Z0-9_]*)'

        def replacer(match):
            var_name = match.group(1) or match.group(2)
            env_value = os.getenv(var_name)

            if env_value is None:
                raise ValueError(
                    f"❌ Variable d'environnement ${{{var_name}}} non définie!\n"
                    f"   Vérifiez votre fichier .env"
                )

            return env_value

        return re.sub(pattern, replacer, value)

    def _validate_config(self):
        """Valide la configuration contre le schéma JSON"""
        if not self.schema:
            logger.warning("⚠️  Validation ignorée (pas de schéma)")
            return

        try:
            validate(instance=self.config, schema=self.schema)
            logger.info("✅ Configuration valide")
        except ValidationError as e:
            raise ValueError(
                f"❌ Configuration invalide:\n"
                f"   {e.message}\n"
                f"   Chemin: {' -> '.join(str(p) for p in e.path)}"
            )

    def get(self, *keys, default=None) -> Any:
        """
        Récupère une valeur de configuration avec notation pointée

        Args:
            *keys: Clés imbriquées (ex: get('auth', 'linkedin_email'))
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

    # === Helpers pour accès direct ===

    @property
    def linkedin_email(self) -> str:
        return self.get('auth', 'linkedin_email')

    @property
    def linkedin_password(self) -> str:
        return self.get('auth', 'linkedin_password')

    @property
    def browser(self) -> str:
        return self.get('auth', 'profile_choice', 'browser', default='firefox')

    @property
    def firefox_profile_path(self) -> str:
        return self.get('auth', 'profile_choice', 'firefox_profile_path')

    @property
    def chrome_profile_dir(self) -> str:
        return self.get('auth', 'profile_choice', 'chrome_profile_dir')

    @property
    def keywords(self) -> list:
        return self.get('search', 'keywords', default=[])

    @property
    def locations(self) -> list:
        return self.get('search', 'locations', default=[])

    @property
    def contract_types(self) -> list:
        return self.get('search', 'contract_types', default=[])

    @property
    def seniority_levels(self) -> list:
        return self.get('search', 'seniority_levels', default=[])

    @property
    def work_modes(self) -> list:
        return self.get('search', 'work_modes', default=[])

    @property
    def date_posted(self) -> str:
        return self.get('search', 'date_posted', default='any')

    @property
    def sort_by(self) -> str:
        return self.get('search', 'sort_by', default='date')

    @property
    def easy_apply_only(self) -> bool:
        return self.get('search', 'easy_apply_only', default=True)

    @property
    def pages_to_scan(self) -> int:
        return self.get('search', 'pages_to_scan', default=5)

    @property
    def max_applications_per_day(self) -> int:
        return self.get('apply', 'max_applications_per_day', default=40)

    @property
    def max_applications_total(self) -> int:
        return self.get('apply', 'max_applications_total', default=200)

    @property
    def delay_between_applications(self) -> tuple:
        delays = self.get('apply', 'delay_between_applications_seconds', default=[8, 20])
        return tuple(delays)

    @property
    def timeout_seconds(self) -> int:
        return self.get('apply', 'timeout_seconds', default=60)

    @property
    def forbidden_hours(self) -> list:
        return self.get('apply', 'forbidden_hours', default=[])

    @property
    def message_to_recruiter(self) -> str:
        return self.get('apply', 'message_to_recruiter')

    @property
    def ai_enabled(self) -> bool:
        return self.get('apply', 'ai_answers', 'enable', default=False)

    @property
    def ai_model(self) -> str:
        return self.get('apply', 'ai_answers', 'model', default='llama3.1:8b')

    @property
    def ollama_base_url(self) -> str:
        return self.get('apply', 'ai_answers', 'ollama_base_url', default='http://localhost:11434')

    @property
    def output_dir(self) -> Path:
        dir_name = self.get('logging', 'output_dir', default='runs')
        return Path(dir_name)

    @property
    def save_json_applied(self) -> bool:
        return self.get('logging', 'save_json_applied', default=True)

    @property
    def json_filename(self) -> str:
        return self.get('logging', 'json_filename', default='applications_log.json')

    @property
    def save_screenshots_on_error(self) -> bool:
        return self.get('logging', 'save_screenshots_on_error', default=True)

    @property
    def log_level(self) -> str:
        return self.get('logging', 'log_level', default='INFO')

    @property
    def dry_run(self) -> bool:
        return self.get('safety', 'dry_run', default=False)

    @property
    def show_browser(self) -> bool:
        return self.get('safety', 'show_browser', default=True)

    def print_summary(self):
        """Affiche un résumé de la configuration"""
        print("\n" + "=" * 80)
        print("📋 RÉSUMÉ DE LA CONFIGURATION")
        print("=" * 80)
        print(f"\n🔐 Authentification:")
        print(f"   • Email: {self.linkedin_email}")
        print(f"   • Navigateur: {self.browser}")

        print(f"\n🔍 Recherche:")
        print(f"   • Mots-clés: {', '.join(self.keywords[:3])}{'...' if len(self.keywords) > 3 else ''}")
        print(f"   • Localisations: {', '.join(self.locations)}")
        print(f"   • Contrats: {', '.join(self.contract_types)}")
        print(f"   • Niveaux: {', '.join(self.seniority_levels)}")
        print(f"   • Modes: {', '.join(self.work_modes)}")
        print(f"   • Date: {self.date_posted}")
        print(f"   • Easy Apply: {self.easy_apply_only}")
        print(f"   • Pages: {self.pages_to_scan}")

        print(f"\n📤 Application:")
        print(f"   • Max/jour: {self.max_applications_per_day}")
        print(f"   • Max total: {self.max_applications_total}")
        print(f"   • Délai: {self.delay_between_applications[0]}-{self.delay_between_applications[1]}s")
        print(f"   • IA: {'✅ Activée' if self.ai_enabled else '❌ Désactivée'}")

        print(f"\n🛡️  Sécurité:")
        print(f"   • Dry-run: {'✅ OUI (simulation)' if self.dry_run else '❌ NON (réel)'}")
        print(f"   • Afficher navigateur: {self.show_browser}")

        print("=" * 80)


if __name__ == "__main__":
    # Test de chargement
    logging.basicConfig(level=logging.INFO)
    try:
        config = ConfigManager()
        config.print_summary()
    except Exception as e:
        logger.error(f"❌ Erreur: {e}")
