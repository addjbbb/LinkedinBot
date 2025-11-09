#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LinkedIn Auto-Apply Bot - Point d'entrée principal
Version 2.0 avec Firefox, Ollama IA, et configuration YAML
"""

import sys
import logging
from pathlib import Path

# Ajouter src au path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.config_manager import ConfigManager
from src.browser_manager import BrowserManager
from src.logger_manager import LoggerManager
from src.ollama_client import OllamaClient
from src.linkedin_filters import LinkedInFilters
from src.job_searcher import JobSearcher
from src.job_applicator import JobApplicator


def setup_logging(config: ConfigManager):
    """Configure le système de logging"""
    log_level = getattr(logging, config.log_level, logging.INFO)

    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(config.output_dir / 'bot.log', encoding='utf-8')
        ]
    )

    # Réduire le bruit des logs Selenium, urllib3 et WebDriver Manager
    logging.getLogger("selenium").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("WDM").setLevel(logging.WARNING)

    return logging.getLogger(__name__)


def main():
    """Fonction principale"""
    print("=" * 80)
    print("🤖 LINKEDIN AUTO-APPLY BOT - v2.0")
    print("=" * 80)

    try:
        # 1. Charger la configuration
        config = ConfigManager()
        config.print_summary()

        # 2. Setup logging
        logger = setup_logging(config)

        # 3. Vérifier le mode dry-run
        if config.dry_run:
            logger.warning("⚠️  MODE DRY-RUN ACTIVÉ - Aucune candidature ne sera réellement envoyée")

        # 4. Initialiser le gestionnaire de logs
        log_manager = LoggerManager(config)

        # 5. Initialiser le client IA (si activé)
        ollama = OllamaClient(config) if config.ai_enabled else None

        # 6. Initialiser le navigateur
        logger.info("🌐 Initialisation du navigateur...")
        with BrowserManager(config) as browser:

            # 7. Initialiser job_searcher et job_applicator
            job_searcher = JobSearcher(browser, config)
            job_applicator = JobApplicator(browser, config, ollama, log_manager)

            # 8. Connexion LinkedIn
            if not job_applicator.login():
                logger.error("❌ Échec de la connexion LinkedIn")
                sys.exit(1)

            # 9. Générer les URLs de recherche
            search_urls = LinkedInFilters.generate_search_urls(config)
            logger.info(f"🔍 {len(search_urls)} combinaison(s) de recherche générées")

            # 10. Pour chaque URL, scraper et appliquer
            all_jobs_found = 0
            all_jobs_applied = 0

            for url_data in search_urls:
                logger.info(f"\n{'='*80}")
                logger.info(f"📋 Recherche: {url_data['keyword']} @ {url_data['location']}")
                logger.info(f"{'='*80}")

                # Scraper les offres
                jobs = job_searcher.search(url_data['url'])
                all_jobs_found += len(jobs)

                logger.info(f"🎯 {len(jobs)} offres à traiter pour cette recherche")

                # Appliquer aux offres
                for i, job in enumerate(jobs, 1):
                    logger.info(f"\n[{i}/{len(jobs)}] Traitement de: {job['title']} @ {job['company']}")

                    # Vérifier si on peut continuer
                    if not job_applicator._check_limits():
                        logger.warning("⚠️ Limites atteintes, arrêt des candidatures")
                        break

                    # Tenter la candidature
                    if job_applicator.apply(job):
                        all_jobs_applied += 1

                # Si limites atteintes, arrêter toutes les recherches
                if not job_applicator._check_limits():
                    logger.warning("⚠️ Limites atteintes, arrêt de toutes les recherches")
                    break

            # 11. Afficher les statistiques finales
            logger.info(f"\n{'='*80}")
            logger.info("📊 STATISTIQUES FINALES")
            logger.info(f"{'='*80}")
            logger.info(f"Offres trouvées: {all_jobs_found}")
            logger.info(f"Candidatures réussies: {all_jobs_applied}")
            log_manager.print_statistics()

        logger.info("✅ Exécution terminée avec succès")

    except KeyboardInterrupt:
        print("\n⚠️  Interruption utilisateur")
        sys.exit(0)
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
