#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Module de recherche et scraping des offres LinkedIn
Gère la pagination, l'extraction des données et les sélecteurs robustes
"""

import logging
import time
from typing import List, Dict, Optional
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

logger = logging.getLogger(__name__)


class JobSearcher:
    """Classe pour scraper les offres LinkedIn avec Easy Apply"""

    # Sélecteurs pour trouver les offres (approche robuste basée sur data-occludable-job-id)
    JOB_CARD_SELECTOR = "//li[@data-occludable-job-id]"

    # Sélecteurs pour la page individuelle de l'offre (basés sur le code original)
    TITLE_SELECTOR = "//h1[contains(@class, 'job-title')]"
    COMPANY_SELECTOR = "//div[contains(@class, 'job-details-jobs')]//div"
    LOCATION_SELECTOR = "//span[contains(@class,'ui-label ui-label--accent-3 text-body-small')]//span[contains(@aria-hidden,'true')]"
    # Sélecteur du bouton Easy Apply (ne cherche pas le texte car peut être en français ou anglais)
    EASY_APPLY_BUTTON = "//div[contains(@class,'jobs-apply-button--top-card')]//button[contains(@class, 'jobs-apply-button')]"

    def __init__(self, driver, config):
        """
        Initialise le chercheur d'offres

        Args:
            driver: Instance Selenium WebDriver
            config: ConfigManager avec les paramètres
        """
        self.driver = driver
        self.config = config
        self.wait = WebDriverWait(driver, config.timeout_seconds)

    def _extract_job_id(self, job_card) -> Optional[str]:
        """
        Extrait uniquement l'ID depuis une carte d'offre

        Args:
            job_card: Élément DOM de la carte d'offre

        Returns:
            Job ID ou None
        """
        try:
            # Extraction du job_id depuis l'attribut data-occludable-job-id
            job_id = job_card.get_attribute('data-occludable-job-id')
            if job_id:
                # Nettoyer l'URN (format: "urn:li:jobPosting:1234567" -> "1234567")
                if ':' in job_id:
                    job_id = job_id.split(':')[-1]
                return job_id
            else:
                logger.warning("Job ID non trouvé pour une offre")
                return None

        except Exception as e:
            logger.error(f"Erreur lors de l'extraction du job ID: {e}")
            return None

    def _extract_job_details(self, job_id: str) -> Optional[Dict]:
        """
        Extrait les détails d'une offre depuis sa page individuelle

        Args:
            job_id: ID de l'offre

        Returns:
            Dictionnaire avec les données de l'offre ou None
        """
        try:
            # Construire l'URL de l'offre
            job_url = f"https://www.linkedin.com/jobs/view/{job_id}"

            # Naviguer vers l'offre
            self.driver.get(job_url)
            time.sleep(2)  # Attendre le chargement

            # Extraire le titre
            try:
                title_elem = self.driver.find_element(By.XPATH, self.TITLE_SELECTOR)
                title = title_elem.text.strip()
            except:
                title = "Titre inconnu"
                logger.warning(f"Titre non trouvé pour l'offre {job_id}")

            # Extraire les détails du job (entreprise, lieu, etc.)
            try:
                time.sleep(2)  # Attendre que les détails se chargent
                job_detail_elem = self.driver.find_element(By.XPATH, self.COMPANY_SELECTOR)
                job_detail = job_detail_elem.text.replace("·", "|").strip()

                # Essayer de séparer entreprise et location
                parts = job_detail.split("|")
                company = parts[0].strip() if len(parts) > 0 else "Entreprise inconnue"
                location = parts[1].strip() if len(parts) > 1 else "Lieu inconnu"
            except:
                company = "Entreprise inconnue"
                location = "Lieu inconnu"
                logger.warning(f"Détails non trouvés pour l'offre {job_id}")

            # Vérifier si Easy Apply est disponible
            try:
                self.driver.find_element(By.XPATH, self.EASY_APPLY_BUTTON)
                easy_apply = True
            except:
                easy_apply = False

            # Si easy_apply_only est activé et que ce n'est pas Easy Apply, ignorer
            if self.config.easy_apply_only and not easy_apply:
                logger.debug(f"Offre {job_id} ignorée (pas Easy Apply)")
                return None

            job_data = {
                'id': job_id,
                'title': title,
                'company': company,
                'location': location,
                'link': job_url,
                'easy_apply': easy_apply
            }

            logger.debug(f"Offre extraite: {title} @ {company} (Easy Apply: {easy_apply})")
            return job_data

        except Exception as e:
            logger.error(f"Erreur lors de l'extraction des détails de l'offre {job_id}: {e}")
            return None

    def _scroll_job_list(self):
        """Fait défiler la liste des offres pour charger plus de résultats"""
        try:
            # Trouver le conteneur de la liste
            list_container = self.driver.find_element(By.CLASS_NAME, "jobs-search-results-list")

            # Scroll progressif
            last_height = self.driver.execute_script("return arguments[0].scrollHeight", list_container)

            for _ in range(3):  # 3 tentatives de scroll
                self.driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", list_container)
                time.sleep(1.5)  # Attendre le chargement

                new_height = self.driver.execute_script("return arguments[0].scrollHeight", list_container)
                if new_height == last_height:
                    break  # Plus de nouvelles offres
                last_height = new_height

        except Exception as e:
            logger.warning(f"Erreur lors du scroll: {e}")

    def _go_to_next_page(self) -> bool:
        """
        Navigue vers la page suivante de résultats

        Returns:
            True si la navigation a réussi, False sinon
        """
        try:
            # Chercher le bouton "Suivant" / "Next"
            next_button_selectors = [
                "button[aria-label='Suivant']",
                "button[aria-label='Next']",
                "button.artdeco-pagination__button--next",
                "li.artdeco-pagination__indicator--number.active + li button"
            ]

            next_button = self._find_element_with_alternatives(self.driver, next_button_selectors)

            if next_button and next_button.is_enabled():
                next_button.click()
                time.sleep(3)  # Attendre le chargement de la page
                logger.info("Navigation vers la page suivante")
                return True
            else:
                logger.info("Pas de page suivante disponible")
                return False

        except Exception as e:
            logger.warning(f"Erreur lors de la pagination: {e}")
            return False

    def search(self, search_url: str) -> List[Dict]:
        """
        Effectue une recherche et extrait toutes les offres

        Args:
            search_url: URL de recherche LinkedIn complète

        Returns:
            Liste de dictionnaires contenant les données des offres
        """
        logger.info(f"Recherche sur: {search_url}")
        all_jobs = []
        all_job_ids = []

        try:
            # Charger la page de recherche
            self.driver.get(search_url)
            time.sleep(3)  # Attendre le chargement initial

            # Parcourir les pages
            for page_num in range(1, self.config.pages_to_scan + 1):
                logger.info(f"Scan de la page {page_num}/{self.config.pages_to_scan}")

                # Scroll pour charger toutes les offres de la page
                self._scroll_job_list()

                # Extraire les cartes d'offres avec XPath
                try:
                    job_cards = self.driver.find_elements(By.XPATH, self.JOB_CARD_SELECTOR)
                    logger.info(f"{len(job_cards)} offres trouvées sur la page {page_num}")
                except Exception as e:
                    logger.error(f"Erreur lors de la recherche des cartes d'offres: {e}")
                    job_cards = []

                # Extraire les IDs de chaque offre
                for card in job_cards:
                    job_id = self._extract_job_id(card)
                    if job_id and job_id not in all_job_ids:
                        all_job_ids.append(job_id)

                # Aller à la page suivante (sauf si dernière page)
                if page_num < self.config.pages_to_scan:
                    if not self._go_to_next_page():
                        logger.info("Pas de page suivante, arrêt de la pagination")
                        break

            logger.info(f"Total: {len(all_job_ids)} IDs d'offres uniques collectés")

            # Maintenant extraire les détails de chaque offre
            for i, job_id in enumerate(all_job_ids, 1):
                logger.info(f"Extraction des détails de l'offre {i}/{len(all_job_ids)} (ID: {job_id})")
                job_data = self._extract_job_details(job_id)
                if job_data:
                    all_jobs.append(job_data)

            logger.info(f"Total: {len(all_jobs)} offres avec détails extraites (Easy Apply: {sum(1 for j in all_jobs if j['easy_apply'])})")
            return all_jobs

        except TimeoutException:
            logger.error("Timeout lors du chargement de la page de recherche")
            return all_jobs
        except Exception as e:
            logger.error(f"Erreur lors de la recherche: {e}", exc_info=True)
            return all_jobs
