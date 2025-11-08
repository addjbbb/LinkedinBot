#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gestionnaire de logs et export JSON des candidatures
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List

logger = logging.getLogger(__name__)


class LoggerManager:
    """Gestionnaire centralisé des logs et exports JSON"""

    def __init__(self, config_manager):
        """
        Initialise le gestionnaire de logs

        Args:
            config_manager: Instance de ConfigManager
        """
        self.config = config_manager
        self.output_dir = config_manager.output_dir
        self.json_filename = config_manager.json_filename
        self.save_json = config_manager.save_json_applied

        # Créer le dossier de sortie
        self.output_dir.mkdir(exist_ok=True)

        self.applications_log = []
        self._load_existing_log()

    def _load_existing_log(self):
        """Charge le log existant si présent"""
        json_path = self.output_dir / self.json_filename
        if json_path.exists():
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    self.applications_log = json.load(f)
                logger.info(f"📂 Log existant chargé: {len(self.applications_log)} entrées")
            except Exception as e:
                logger.warning(f"⚠️  Impossible de charger le log existant: {e}")
                self.applications_log = []

    def log_application_queued(self, job_data: Dict) -> None:
        """
        Enregistre une candidature en attente (avant tentative)

        Args:
            job_data: Données de l'offre
        """
        entry = {
            "timestamp": datetime.now().isoformat(),
            "job_id": job_data.get('id'),
            "title": job_data.get('title'),
            "company": job_data.get('company'),
            "location": job_data.get('location'),
            "link": job_data.get('link'),
            "easy_apply": job_data.get('easy_apply', True),
            "filters_snapshot": {
                "keywords": self.config.keywords,
                "locations": self.config.locations,
                "contract_types": self.config.contract_types,
                "seniority_levels": self.config.seniority_levels,
            },
            "status": "queued",
            "notes": None,
            "screenshot_path": None
        }

        self.applications_log.append(entry)
        self._save_log()
        logger.debug(f"📝 Candidature queued: {job_data.get('title')}")

    def log_application_result(self, job_data: Dict, success: bool, notes: str = None, screenshot_path: str = None) -> None:
        """
        Met à jour le résultat d'une candidature

        Args:
            job_data: Données de l'offre
            success: True si candidature envoyée
            notes: Notes complémentaires
            screenshot_path: Chemin vers screenshot si erreur
        """
        # Trouver l'entrée queued correspondante
        job_id = job_data.get('id')
        for entry in reversed(self.applications_log):
            if entry.get('job_id') == job_id and entry.get('status') == 'queued':
                entry['status'] = 'applied' if success else 'failed'
                entry['notes'] = notes
                entry['screenshot_path'] = screenshot_path
                entry['timestamp'] = datetime.now().isoformat()
                break
        else:
            # Si pas trouvé, créer nouvelle entrée
            self.log_application_queued(job_data)
            self.applications_log[-1]['status'] = 'applied' if success else 'failed'
            self.applications_log[-1]['notes'] = notes
            self.applications_log[-1]['screenshot_path'] = screenshot_path

        self._save_log()
        status_emoji = "✅" if success else "❌"
        logger.info(f"{status_emoji} {job_data.get('title')} - {entry['status']}")

    def _save_log(self):
        """Sauvegarde le log JSON"""
        if not self.save_json:
            return

        json_path = self.output_dir / self.json_filename
        try:
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(self.applications_log, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"❌ Erreur sauvegarde log: {e}")

    def get_statistics(self) -> Dict:
        """
        Calcule des statistiques sur les candidatures

        Returns:
            Dict avec statistiques
        """
        total = len(self.applications_log)
        applied = sum(1 for entry in self.applications_log if entry['status'] == 'applied')
        failed = sum(1 for entry in self.applications_log if entry['status'] == 'failed')
        queued = sum(1 for entry in self.applications_log if entry['status'] == 'queued')

        return {
            "total": total,
            "applied": applied,
            "failed": failed,
            "queued": queued,
            "success_rate": (applied / total * 100) if total > 0 else 0
        }

    def print_statistics(self):
        """Affiche les statistiques"""
        stats = self.get_statistics()

        print("\n" + "=" * 80)
        print("📊 STATISTIQUES DES CANDIDATURES")
        print("=" * 80)
        print(f"\n📝 Total: {stats['total']}")
        print(f"✅ Envoyées: {stats['applied']}")
        print(f"❌ Échouées: {stats['failed']}")
        print(f"⏳ En attente: {stats['queued']}")
        print(f"📈 Taux de réussite: {stats['success_rate']:.1f}%")
        print("=" * 80)
