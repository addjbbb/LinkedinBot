#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gestionnaire de navigateur avec support Firefox (préféré) et Chrome (fallback)
Utilise Selenium avec attentes explicites robustes
"""

import logging
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, WebDriverException

logger = logging.getLogger(__name__)


class BrowserManager:
    """Gestionnaire de navigateur Firefox/Chrome avec profil support"""

    def __init__(self, config_manager):
        """
        Initialise le navigateur selon la configuration

        Args:
            config_manager: Instance de ConfigManager
        """
        self.config = config_manager
        self.driver = None
        self.wait = None

        self._initialize_browser()

    def _initialize_browser(self):
        """Initialise le navigateur (Firefox prioritaire, Chrome fallback)"""
        browser_type = self.config.browser.lower()

        if browser_type == "firefox":
            try:
                self.driver = self._create_firefox_driver()
                logger.info("✅ Navigateur Firefox initialisé")
                return
            except Exception as e:
                logger.warning(f"⚠️  Firefox non disponible: {e}")
                logger.info("🔄 Fallback vers Chrome...")

        # Fallback Chrome (ou si explicitement demandé)
        try:
            self.driver = self._create_chrome_driver()
            logger.info("✅ Navigateur Chrome initialisé")
        except Exception as e:
            raise RuntimeError(f"❌ Impossible d'initialiser un navigateur: {e}")

        # Créer le WebDriverWait
        self.wait = WebDriverWait(self.driver, self.config.timeout_seconds)

    def _create_firefox_driver(self):
        """Crée un driver Firefox avec options"""
        from selenium.webdriver.firefox.service import Service as FirefoxService
        from selenium.webdriver.firefox.options import Options as FirefoxOptions

        options = FirefoxOptions()

        # Headless si configuré
        if not self.config.show_browser:
            options.add_argument('--headless')

        # Profil Firefox personnalisé si fourni
        if self.config.firefox_profile_path:
            profile_path = Path(self.config.firefox_profile_path)
            if profile_path.exists():
                options.profile = webdriver.FirefoxProfile(str(profile_path))
                logger.info(f"📂 Utilisation du profil Firefox: {profile_path}")

        # Options anti-détection
        options.set_preference("dom.webdriver.enabled", False)
        options.set_preference("useAutomationExtension", False)
        options.set_preference("general.useragent.override",
                             "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0")

        return webdriver.Firefox(options=options)

    def _create_chrome_driver(self):
        """Crée un driver Chrome avec options"""
        from selenium.webdriver.chrome.service import Service as ChromeService
        from selenium.webdriver.chrome.options import Options as ChromeOptions
        from webdriver_manager.chrome import ChromeDriverManager

        options = ChromeOptions()

        # Headless si configuré
        if not self.config.show_browser:
            options.add_argument('--headless=new')

        # Profil Chrome personnalisé si fourni
        if self.config.chrome_profile_dir:
            profile_dir = Path(self.config.chrome_profile_dir)
            if profile_dir.exists():
                options.add_argument(f'--user-data-dir={profile_dir.parent}')
                options.add_argument(f'--profile-directory={profile_dir.name}')
                logger.info(f"📂 Utilisation du profil Chrome: {profile_dir}")

        # Options anti-détection
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        options.add_argument('user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36')

        service = ChromeService(ChromeDriverManager().install())
        return webdriver.Chrome(service=service, options=options)

    def get(self, url: str, wait_for_selector: str = None):
        """
        Navigue vers une URL avec attente optionnelle

        Args:
            url: URL cible
            wait_for_selector: Sélecteur CSS à attendre (optionnel)
        """
        self.driver.get(url)
        logger.debug(f"🌐 Navigation vers: {url}")

        if wait_for_selector:
            try:
                self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, wait_for_selector)))
            except TimeoutException:
                logger.warning(f"⏱️  Timeout en attendant: {wait_for_selector}")

    def wait_for_element(self, by: By, value: str, timeout: int = None):
        """
        Attend qu'un élément soit présent

        Args:
            by: Type de sélecteur (By.CSS_SELECTOR, By.XPATH, etc.)
            value: Valeur du sélecteur
            timeout: Timeout personnalisé (optionnel)

        Returns:
            WebElement ou None si timeout
        """
        wait = WebDriverWait(self.driver, timeout or self.config.timeout_seconds)
        try:
            return wait.until(EC.presence_of_element_located((by, value)))
        except TimeoutException:
            logger.warning(f"⏱️  Element non trouvé: {value}")
            return None

    def safe_click(self, element):
        """
        Clique sur un élément de manière sécurisée

        Args:
            element: WebElement

        Returns:
            bool: True si succès, False sinon
        """
        try:
            element.click()
            return True
        except Exception as e:
            logger.warning(f"⚠️  Echec du clic: {e}")
            return False

    def take_screenshot(self, filename: str):
        """
        Prend une capture d'écran

        Args:
            filename: Nom du fichier (avec chemin)
        """
        try:
            self.driver.save_screenshot(filename)
            logger.info(f"📸 Screenshot: {filename}")
        except Exception as e:
            logger.error(f"❌ Echec screenshot: {e}")

    def quit(self):
        """Ferme le navigateur proprement"""
        if self.driver:
            try:
                self.driver.quit()
                logger.info("✅ Navigateur fermé")
            except Exception as e:
                logger.error(f"⚠️  Erreur fermeture: {e}")

    def __enter__(self):
        """Support du context manager - retourne le driver Selenium"""
        return self.driver

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Nettoyage automatique"""
        self.quit()
