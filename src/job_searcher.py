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

    # Sélecteurs multiples pour les containers de résultats (fallback cascade)
    RESULTS_CONTAINER_SELECTORS = [
        (By.CSS_SELECTOR, "ul.scaffold-layout__list-container"),
        (By.CSS_SELECTOR, "div.scaffold-layout__list"),
        (By.CSS_SELECTOR, "ul.jobs-search__results-list"),
        (By.CLASS_NAME, "jobs-search-results-list")
    ]

    # Sélecteurs multiples pour les cartes d'offres
    JOB_CARD_SELECTORS = [
        (By.CSS_SELECTOR, "li[data-occludable-job-id]"),
        (By.CSS_SELECTOR, "li.jobs-search-results__list-item"),
        (By.CSS_SELECTOR, "div.base-card")
    ]

    # Sélecteurs pour la page individuelle de l'offre (avec fallbacks)
    TITLE_SELECTORS = [
        (By.CSS_SELECTOR, "h1.job-details-jobs-unified-top-card__job-title"),
        (By.CSS_SELECTOR, "h1.top-card-layout__title"),
        (By.CSS_SELECTOR, "h1.top-card__title"),
        (By.XPATH, "//h1[contains(@class, 'job-title')]")
    ]

    COMPANY_SELECTORS = [
        (By.CSS_SELECTOR, "a.job-details-jobs-unified-top-card__company-name"),
        (By.CSS_SELECTOR, "a.topcard__org-name-link"),
        (By.CSS_SELECTOR, "span.top-card-layout__second-subline a"),
        (By.XPATH, "//div[contains(@class, 'job-details-jobs')]//div")
    ]

    # XPath pour bouton Easy Apply (FR/EN)
    EASY_APPLY_XPATHS = [
        "//button[.//span[contains(., 'Postuler facilement')]]",
        "//button[.//span[contains(., 'Postuler')]]",
        "//button[contains(., 'Postuler')]",
        "//button[.//span[contains(., 'Easy Apply')]]",
        "//button[contains(., 'Easy Apply')]",
        "//button[contains(@class,'jobs-apply-button')]"
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

    def _accept_cookies_if_present(self):
        """Accepte la bannière de cookies si présente"""
        try:
            # FR et EN
            cookie_buttons = [
                "//button[contains(., 'Accepter')]",
                "//button[contains(., 'Tout accepter')]",
                "//button[contains(., 'Accept')]",
                "//button[contains(., 'Accept all')]"
            ]
            for xpath in cookie_buttons:
                try:
                    btn = self.driver.find_element(By.XPATH, xpath)
                    if btn.is_displayed():
                        btn.click()
                        time.sleep(1)
                        logger.info("✅ Bannière cookies acceptée")
                        return
                except:
                    continue
        except Exception as e:
            logger.debug(f"Pas de bannière cookies ou erreur: {e}")

    def _wait_results_container(self):
        """
        Attend et retourne le container de résultats avec fallback cascade

        Returns:
            WebElement du container ou None
        """
        for by, selector in self.RESULTS_CONTAINER_SELECTORS:
            try:
                element = self.wait.until(EC.presence_of_element_located((by, selector)))
                logger.debug(f"Container trouvé avec: {selector}")
                return element
            except TimeoutException:
                continue
        logger.warning("Aucun container de résultats trouvé")
        return None

    def _find_element_with_fallbacks(self, selectors_list, parent=None):
        """
        Cherche un élément avec plusieurs sélecteurs en fallback

        Args:
            selectors_list: Liste de tuples (By, selector)
            parent: Élément parent (ou None pour utiliser driver)

        Returns:
            WebElement trouvé ou None
        """
        search_context = parent if parent else self.driver

        for by, selector in selectors_list:
            try:
                elements = search_context.find_elements(by, selector)
                for elem in elements:
                    if elem.is_displayed() and elem.text.strip():
                        return elem
            except Exception:
                continue
        return None

    def _find_easy_apply_button(self):
        """
        Trouve le bouton Easy Apply avec support FR/EN

        Returns:
            WebElement du bouton ou None
        """
        for xpath in self.EASY_APPLY_XPATHS:
            try:
                buttons = self.driver.find_elements(By.XPATH, xpath)
                for btn in buttons:
                    if btn.is_displayed() and btn.is_enabled():
                        return btn
            except Exception:
                continue
        return None

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

            # Attendre que la page soit chargée (avec fallbacks)
            try:
                self.wait.until(EC.presence_of_element_located((
                    By.CSS_SELECTOR,
                    "h1.job-details-jobs-unified-top-card__job-title, h1.top-card-layout__title, h1"
                )))
            except TimeoutException:
                logger.warning(f"Timeout lors du chargement de l'offre {job_id}")
                return None

            # Extraire le titre avec fallbacks
            title_elem = self._find_element_with_fallbacks(self.TITLE_SELECTORS)
            title = title_elem.text.strip() if title_elem else "Titre inconnu"
            if title == "Titre inconnu":
                logger.warning(f"Titre non trouvé pour l'offre {job_id}")

            # Extraire l'entreprise avec fallbacks
            company_elem = self._find_element_with_fallbacks(self.COMPANY_SELECTORS)
            if company_elem:
                company_text = company_elem.text.strip()
                # Si c'est un bloc de détails (avec |), extraire juste l'entreprise
                if "|" in company_text or "·" in company_text:
                    parts = company_text.replace("·", "|").split("|")
                    company = parts[0].strip()
                    location = parts[1].strip() if len(parts) > 1 else "Lieu inconnu"
                else:
                    company = company_text
                    location = "Lieu inconnu"
            else:
                company = "Entreprise inconnue"
                location = "Lieu inconnu"
                logger.warning(f"Entreprise non trouvée pour l'offre {job_id}")

            # Vérifier si Easy Apply est disponible avec fallbacks FR/EN
            easy_apply_btn = self._find_easy_apply_button()
            easy_apply = easy_apply_btn is not None

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

    def _scroll_job_list(self, container=None):
        """
        Fait défiler la liste des offres pour charger plus de résultats

        Args:
            container: Container à scroller (ou None pour scroll de la page)
        """
        try:
            if container:
                # Scroll dans le container
                self.driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", container)
            else:
                # Scroll de la page complète en fallback
                self.driver.execute_script("window.scrollBy(0, document.body.scrollHeight);")

            time.sleep(1.5)  # Attendre le chargement

        except Exception as e:
            logger.debug(f"Erreur lors du scroll: {e}")

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
            time.sleep(2)

            # Accepter les cookies si présents
            self._accept_cookies_if_present()

            # Attendre le container de résultats avec fallbacks
            container = self._wait_results_container()
            if not container:
                logger.warning("Impossible de trouver le container de résultats, tentative avec la page complète")

            # Parcourir les pages
            for page_num in range(1, self.config.pages_to_scan + 1):
                logger.info(f"Scan de la page {page_num}/{self.config.pages_to_scan}")

                # Scroll pour charger toutes les offres de la page
                for _ in range(3):  # 3 scrolls progressifs
                    self._scroll_job_list(container)

                # Extraire les cartes d'offres avec fallbacks multiples
                job_cards = []
                for by, selector in self.JOB_CARD_SELECTORS:
                    try:
                        cards = self.driver.find_elements(by, selector)
                        if cards:
                            job_cards = cards
                            logger.debug(f"Cartes trouvées avec: {selector}")
                            break
                    except Exception:
                        continue

                logger.info(f"{len(job_cards)} offres trouvées sur la page {page_num}")

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
