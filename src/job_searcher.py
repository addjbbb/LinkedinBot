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

    # Sélecteurs alternatifs pour une recherche robuste
    JOB_CARD_SELECTORS = [
        "li.jobs-search-results__list-item",
        "div.job-card-container",
        "div.job-search-card",
        "li[data-occludable-job-id]"
    ]

    TITLE_SELECTORS = [
        "h3.job-card-list__title",
        "a.job-card-list__title",
        "h3.base-search-card__title",
        "span.job-card-container__job-title"
    ]

    COMPANY_SELECTORS = [
        "h4.job-card-container__company-name",
        "a.job-card-container__company-name",
        "h4.base-search-card__subtitle",
        "span.job-card-container__primary-description"
    ]

    LOCATION_SELECTORS = [
        "div.job-card-container__metadata-item",
        "li.job-card-container__metadata-item",
        "span.job-search-card__location",
        "div.base-search-card__metadata span"
    ]

    EASY_APPLY_SELECTORS = [
        "li-icon[type='lightning-bolt']",
        "span.job-card-container__apply-method",
        "div.job-card-container__easy-apply-label"
    ]

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

    def _find_element_with_alternatives(self, parent, selectors: List[str], by=By.CSS_SELECTOR) -> Optional[any]:
        """
        Cherche un élément avec plusieurs sélecteurs alternatifs

        Args:
            parent: Élément parent (ou driver)
            selectors: Liste de sélecteurs CSS à essayer
            by: Type de sélecteur (défaut: CSS_SELECTOR)

        Returns:
            Élément trouvé ou None
        """
        for selector in selectors:
            try:
                element = parent.find_element(by, selector)
                if element:
                    return element
            except NoSuchElementException:
                continue
        return None

    def _find_elements_with_alternatives(self, parent, selectors: List[str], by=By.CSS_SELECTOR) -> List:
        """
        Cherche des éléments avec plusieurs sélecteurs alternatifs

        Args:
            parent: Élément parent (ou driver)
            selectors: Liste de sélecteurs CSS à essayer
            by: Type de sélecteur (défaut: CSS_SELECTOR)

        Returns:
            Liste d'éléments trouvés
        """
        for selector in selectors:
            try:
                elements = parent.find_elements(by, selector)
                if elements:
                    return elements
            except NoSuchElementException:
                continue
        return []

    def _extract_job_data(self, job_card) -> Optional[Dict]:
        """
        Extrait les données d'une carte d'offre

        Args:
            job_card: Élément DOM de la carte d'offre

        Returns:
            Dictionnaire avec les données de l'offre ou None
        """
        try:
            # Extraction du job_id depuis l'attribut data
            job_id = None
            for attr in ['data-job-id', 'data-occludable-job-id', 'data-entity-urn']:
                job_id = job_card.get_attribute(attr)
                if job_id:
                    # Nettoyer l'URN si nécessaire
                    if ':' in job_id:
                        job_id = job_id.split(':')[-1]
                    break

            if not job_id:
                logger.warning("Job ID non trouvé pour une offre")
                return None

            # Extraction du titre
            title_elem = self._find_element_with_alternatives(job_card, self.TITLE_SELECTORS)
            title = title_elem.text.strip() if title_elem else "Titre inconnu"

            # Extraction du lien
            link = None
            if title_elem and title_elem.tag_name == 'a':
                link = title_elem.get_attribute('href')
            else:
                # Chercher un lien parent
                try:
                    link_elem = job_card.find_element(By.TAG_NAME, 'a')
                    link = link_elem.get_attribute('href') if link_elem else None
                except:
                    pass

            # Nettoyer le lien
            if link and '?' in link:
                link = link.split('?')[0]

            # Extraction de l'entreprise
            company_elem = self._find_element_with_alternatives(job_card, self.COMPANY_SELECTORS)
            company = company_elem.text.strip() if company_elem else "Entreprise inconnue"

            # Extraction du lieu
            location_elem = self._find_element_with_alternatives(job_card, self.LOCATION_SELECTORS)
            location = location_elem.text.strip() if location_elem else "Lieu inconnu"

            # Détection Easy Apply
            easy_apply_elem = self._find_element_with_alternatives(job_card, self.EASY_APPLY_SELECTORS)
            easy_apply = easy_apply_elem is not None

            # Si easy_apply_only est activé et que ce n'est pas Easy Apply, ignorer
            if self.config.easy_apply_only and not easy_apply:
                logger.debug(f"Offre {job_id} ignorée (pas Easy Apply)")
                return None

            job_data = {
                'id': job_id,
                'title': title,
                'company': company,
                'location': location,
                'link': link or f"https://www.linkedin.com/jobs/view/{job_id}",
                'easy_apply': easy_apply
            }

            logger.debug(f"Offre extraite: {title} @ {company} (Easy Apply: {easy_apply})")
            return job_data

        except Exception as e:
            logger.error(f"Erreur lors de l'extraction des données d'offre: {e}")
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

        try:
            # Charger la page de recherche
            self.driver.get(search_url)
            time.sleep(3)  # Attendre le chargement initial

            # Parcourir les pages
            for page_num in range(1, self.config.pages_to_scan + 1):
                logger.info(f"Scan de la page {page_num}/{self.config.pages_to_scan}")

                # Scroll pour charger toutes les offres de la page
                self._scroll_job_list()

                # Extraire les cartes d'offres
                job_cards = self._find_elements_with_alternatives(self.driver, self.JOB_CARD_SELECTORS)
                logger.info(f"{len(job_cards)} offres trouvées sur la page {page_num}")

                # Extraire les données de chaque offre
                for card in job_cards:
                    job_data = self._extract_job_data(card)
                    if job_data:
                        # Éviter les doublons
                        if not any(j['id'] == job_data['id'] for j in all_jobs):
                            all_jobs.append(job_data)

                # Aller à la page suivante (sauf si dernière page)
                if page_num < self.config.pages_to_scan:
                    if not self._go_to_next_page():
                        logger.info("Pas de page suivante, arrêt de la pagination")
                        break

            logger.info(f"Total: {len(all_jobs)} offres uniques extraites")
            return all_jobs

        except TimeoutException:
            logger.error("Timeout lors du chargement de la page de recherche")
            return all_jobs
        except Exception as e:
            logger.error(f"Erreur lors de la recherche: {e}", exc_info=True)
            return all_jobs
