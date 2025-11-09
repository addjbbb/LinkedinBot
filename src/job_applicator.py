#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Module de candidature automatique LinkedIn Easy Apply
Gère la connexion, le remplissage des formulaires et l'intégration IA
"""

import logging
import time
import random
from datetime import datetime, time as dt_time
from typing import Dict, Optional
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys

logger = logging.getLogger(__name__)


class JobApplicator:
    """Classe pour automatiser les candidatures Easy Apply"""

    def __init__(self, driver, config, ollama_client=None, log_manager=None):
        """
        Initialise l'applicateur

        Args:
            driver: Instance Selenium WebDriver
            config: ConfigManager avec les paramètres
            ollama_client: Client Ollama pour l'IA (optionnel)
            log_manager: Gestionnaire de logs (optionnel)
        """
        self.driver = driver
        self.config = config
        self.ollama = ollama_client
        self.log_manager = log_manager
        self.wait = WebDriverWait(driver, config.timeout_seconds)

        # Compteurs
        self.applications_today = 0
        self.applications_total = 0

    def login(self) -> bool:
        """
        Se connecte à LinkedIn avec les identifiants configurés

        Returns:
            True si la connexion a réussi, False sinon
        """
        try:
            logger.info("🔐 Connexion à LinkedIn...")

            # Naviguer vers la page de connexion
            self.driver.get("https://www.linkedin.com/login")
            time.sleep(2)

            # Remplir l'email
            email_field = self.wait.until(
                EC.presence_of_element_located((By.ID, "username"))
            )
            email_field.clear()
            email_field.send_keys(self.config.linkedin_email)

            # Remplir le mot de passe
            password_field = self.driver.find_element(By.ID, "password")
            password_field.clear()
            password_field.send_keys(self.config.linkedin_password)

            # Cliquer sur le bouton de connexion
            login_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            login_button.click()

            # Attendre la redirection
            time.sleep(5)

            # Vérifier si la connexion a réussi
            if "feed" in self.driver.current_url or "mynetwork" in self.driver.current_url:
                logger.info("✅ Connexion réussie")
                return True
            else:
                # Possiblement un défi de sécurité
                logger.warning("⚠️ Vérification de sécurité détectée - intervention manuelle requise")
                input("Appuyez sur Entrée après avoir résolu le défi de sécurité...")
                return True

        except Exception as e:
            logger.error(f"❌ Erreur lors de la connexion: {e}")
            return False

    def _is_in_forbidden_hours(self) -> bool:
        """
        Vérifie si l'heure actuelle est dans les plages interdites

        Returns:
            True si dans une plage interdite, False sinon
        """
        if not self.config.forbidden_hours:
            return False

        now = datetime.now().time()

        for period in self.config.forbidden_hours:
            start = dt_time.fromisoformat(period['start'])
            end = dt_time.fromisoformat(period['end'])

            # Gérer les plages qui traversent minuit
            if start <= end:
                if start <= now <= end:
                    return True
            else:
                if now >= start or now <= end:
                    return True

        return False

    def _random_delay(self):
        """Applique un délai aléatoire entre les candidatures"""
        min_delay, max_delay = self.config.delay_between_applications_seconds
        delay = random.uniform(min_delay, max_delay)
        logger.debug(f"Délai de {delay:.1f} secondes...")
        time.sleep(delay)

    def _check_limits(self) -> bool:
        """
        Vérifie si les limites de candidature sont atteintes

        Returns:
            True si on peut continuer, False sinon
        """
        if self.applications_today >= self.config.max_applications_per_day:
            logger.warning(f"⚠️ Limite journalière atteinte ({self.config.max_applications_per_day})")
            return False

        if self.applications_total >= self.config.max_applications_total:
            logger.warning(f"⚠️ Limite totale atteinte ({self.config.max_applications_total})")
            return False

        if self._is_in_forbidden_hours():
            logger.warning("⚠️ Heure actuelle dans les plages interdites")
            return False

        return True

    def _wait_job_top_card(self, timeout=15):
        """
        Attend que la fiche job (top card) soit chargée

        Args:
            timeout: Timeout en secondes
        """
        wait = WebDriverWait(self.driver, timeout)
        wait.until(EC.presence_of_element_located((
            By.CSS_SELECTOR,
            "div.jobs-unified-top-card, div.job-details-jobs-unified-top-card, div.jobs-details__main-content"
        )))

    def _click_easy_apply_button(self) -> bool:
        """
        Clique sur le bouton Easy Apply/Candidature simplifiée et vérifie l'ouverture du modal.

        Returns:
            True si le bouton a été cliqué et le modal s'est ouvert, False sinon
        """
        try:
            # 1) Attendre que la fiche (top card) soit chargée
            try:
                self._wait_job_top_card(timeout=15)
            except Exception:
                time.sleep(1)

            # 2) Sélecteurs prioritaires (DOM constaté LinkedIn)
            #    - id + classe spécifiques
            #    - conteneur top-card
            priority_selectors = [
                (By.ID, "jobs-apply-button-id"),  # ID direct (le plus fiable)
                (By.CSS_SELECTOR, "div.jobs-apply-button--top-card button.jobs-apply-button"),
            ]

            btn = None
            for by, sel in priority_selectors:
                try:
                    cand = self.driver.find_element(by, sel)
                    if cand.is_displayed() and cand.is_enabled():
                        btn = cand
                        break
                except Exception:
                    continue

            # 3) Fallbacks tolérants (FR/EN + classes Artdeco)
            if not btn:
                xpath_fallbacks = [
                    # Texte FR (dans le span interne)
                    "//button[.//span[contains(normalize-space(.), 'Candidature simplifiée')]]",
                    # Texte EN
                    "//button[.//span[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'easy apply')]]",
                    # Classes génériques LinkedIn
                    "//button[contains(@class,'jobs-apply-button') and contains(@class,'artdeco-button--primary')]",
                ]
                for xp in xpath_fallbacks:
                    elems = self.driver.find_elements(By.XPATH, xp)
                    for el in elems:
                        if el.is_displayed() and el.is_enabled():
                            btn = el
                            break
                    if btn:
                        break

            if not btn:
                logger.warning("Bouton Easy Apply non trouvé")
                return False

            # 4) Scroll + clic (avec fallback JS)
            try:
                self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn)
                time.sleep(0.2)
                btn.click()
            except Exception:
                try:
                    self.driver.execute_script("arguments[0].click();", btn)
                except Exception as e:
                    logger.warning(f"Échec du clic Easy Apply: {e}")
                    return False

            # 5) Confirmer l'ouverture du modal (dialog LinkedIn)
            try:
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div[role='dialog'], div.artdeco-modal"))
                )
                logger.debug("Modal Easy Apply ouvert")
                return True
            except TimeoutException:
                logger.warning("Pas de modal après clic — probablement pas une offre Easy Apply effective")
                return False

        except Exception as e:
            logger.error(f"Erreur lors du clic sur Easy Apply: {e}")
            return False

    def _get_easy_apply_modal(self):
        """
        Renvoie l'élément <div role="dialog"> du modal Easy Apply

        Returns:
            WebElement du modal ou None
        """
        try:
            modals = self.driver.find_elements(By.CSS_SELECTOR, "div[role='dialog'], div.artdeco-modal")
            return modals[0] if modals else None
        except Exception:
            return None

    def _click_modal_primary(self, labels=('Vérifier', 'Suivant', 'Continuer', 'Envoyer', 'Soumettre', 'Review', 'Next', 'Continue', 'Submit')):
        """
        Clique sur le bouton primaire dans le footer du modal selon les libellés FR/EN.

        Args:
            labels: Tuple de libellés à rechercher (FR/EN)

        Returns:
            'progress' si bouton intermédiaire cliqué (Vérifier/Suivant)
            'submit' si bouton final cliqué (Envoyer/Soumettre)
            None si aucun bouton trouvé
        """
        modal = self._get_easy_apply_modal()
        if not modal:
            return None

        # 1) Bouton primaire standard (artdeco primary) dans le footer du modal
        candidates = modal.find_elements(
            By.CSS_SELECTOR,
            "footer .artdeco-button--primary, footer button[type='submit']"
        )

        # 2) Fallback: tous les boutons visibles dans le modal
        if not candidates:
            candidates = modal.find_elements(By.CSS_SELECTOR, "button, a[role='button']")

        btn_to_click = None
        kind = None
        for b in candidates:
            if not (b.is_displayed() and b.is_enabled()):
                continue
            text = (b.text or "").strip().lower()
            aria = (b.get_attribute("aria-label") or "").strip().lower()
            if any(k.lower() in text for k in [t.lower() for t in labels]) or \
               any(k.lower() in aria for k in [t.lower() for t in labels]):
                btn_to_click = b
                # Deviner l'étape selon le libellé
                if any(x in text or x in aria for x in ['envoyer', 'soumettre', 'submit']):
                    kind = 'submit'
                else:
                    kind = 'progress'
                break

        if not btn_to_click:
            return None

        # Éviter le clic sur la croix (header) : on ne clique que le footer
        try:
            self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn_to_click)
            time.sleep(0.2)
            btn_to_click.click()
            logger.debug(f"Bouton modal cliqué: '{btn_to_click.text}' (type: {kind})")
        except Exception:
            try:
                self.driver.execute_script("arguments[0].click();", btn_to_click)
                logger.debug(f"Bouton modal cliqué via JS: '{btn_to_click.text}' (type: {kind})")
            except Exception as e:
                logger.warning(f"Échec du clic sur bouton modal: {e}")
                return None

        return kind

    def _fill_text_field(self, field, value: str):
        """
        Remplit un champ texte

        Args:
            field: Élément du champ
            value: Valeur à remplir
        """
        try:
            field.clear()
            field.send_keys(value)
        except:
            # Méthode alternative si clear() échoue
            field.send_keys(Keys.CONTROL + "a")
            field.send_keys(Keys.DELETE)
            field.send_keys(value)

    def _answer_question(self, question_text: str, job_data: Dict) -> str:
        """
        Génère une réponse à une question via l'IA ou retourne une valeur par défaut

        Args:
            question_text: Texte de la question
            job_data: Données de l'offre pour le contexte

        Returns:
            Réponse générée
        """
        if self.ollama and self.config.ai_enabled:
            try:
                answer = self.ollama.generate_answer(question_text, job_data)
                logger.debug(f"Réponse IA pour '{question_text}': {answer}")
                return answer
            except Exception as e:
                logger.warning(f"Erreur IA, réponse par défaut: {e}")

        # Réponses par défaut basées sur des mots-clés
        question_lower = question_text.lower()

        if any(word in question_lower for word in ['salary', 'salaire', 'rémunération']):
            return "Négociable selon expérience"
        elif any(word in question_lower for word in ['experience', 'expérience', 'years']):
            return "2"
        elif any(word in question_lower for word in ['disponibilité', 'availability', 'start']):
            return "Immédiatement"
        elif any(word in question_lower for word in ['motivation', 'pourquoi', 'why']):
            return "Je suis très intéressé par cette opportunité et je pense que mon profil correspond parfaitement."
        else:
            return "Oui"

    def _fill_form(self, job_data: Dict) -> bool:
        """
        Remplit le formulaire Easy Apply

        Args:
            job_data: Données de l'offre

        Returns:
            True si le formulaire a été rempli avec succès, False sinon
        """
        try:
            # Attendre que le formulaire soit chargé
            time.sleep(2)

            # Chercher tous les champs de texte
            text_fields = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text'], textarea")

            for field in text_fields:
                try:
                    # Récupérer le label ou le placeholder
                    label = field.get_attribute('aria-label') or field.get_attribute('placeholder') or ""

                    if not label:
                        # Chercher un label associé
                        field_id = field.get_attribute('id')
                        if field_id:
                            try:
                                label_elem = self.driver.find_element(By.CSS_SELECTOR, f"label[for='{field_id}']")
                                label = label_elem.text
                            except:
                                pass

                    # Si le champ est vide et nécessite une réponse
                    if not field.get_attribute('value'):
                        answer = self._answer_question(label, job_data)
                        self._fill_text_field(field, answer)
                        logger.debug(f"Champ '{label}' rempli avec: {answer}")

                except Exception as e:
                    logger.debug(f"Erreur sur un champ texte: {e}")
                    continue

            # Gérer les radio buttons et checkboxes
            self._handle_radio_and_checkboxes()

            # Ajouter le message au recruteur si configuré
            self._add_recruiter_message()

            return True

        except Exception as e:
            logger.error(f"Erreur lors du remplissage du formulaire: {e}")
            return False

    def _handle_radio_and_checkboxes(self):
        """Gère les boutons radio et cases à cocher"""
        try:
            # Radio buttons - sélectionner la première option par défaut
            radio_groups = self.driver.find_elements(By.CSS_SELECTOR, "input[type='radio']")
            processed_names = set()

            for radio in radio_groups:
                name = radio.get_attribute('name')
                if name and name not in processed_names:
                    if not any(r.is_selected() for r in self.driver.find_elements(By.CSS_SELECTOR, f"input[name='{name}']")):
                        # Sélectionner le premier radio du groupe
                        try:
                            radio.click()
                            processed_names.add(name)
                        except:
                            pass

            # Checkboxes optionnelles - ne rien faire par défaut
            # L'utilisateur peut les gérer manuellement si nécessaire

        except Exception as e:
            logger.debug(f"Erreur lors de la gestion des radio/checkboxes: {e}")

    def _add_recruiter_message(self):
        """Ajoute le message au recruteur si configuré"""
        if not self.config.message_to_recruiter:
            return

        try:
            # Chercher le champ de message
            message_selectors = [
                "textarea[name='message']",
                "textarea[id*='message']",
                "textarea.msg-form__contenteditable"
            ]

            for selector in message_selectors:
                try:
                    message_field = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if message_field:
                        self._fill_text_field(message_field, self.config.message_to_recruiter)
                        logger.debug("Message au recruteur ajouté")
                        break
                except NoSuchElementException:
                    continue

        except Exception as e:
            logger.debug(f"Pas de champ de message ou erreur: {e}")

    def _submit_application(self) -> bool:
        """
        Soumet la candidature

        Returns:
            True si la soumission a réussi, False sinon
        """
        try:
            # Chercher le bouton de soumission
            submit_selectors = [
                "button[aria-label*='Envoyer']",
                "button[aria-label*='Submit']",
                "button[aria-label*='Review']",
                "button.artdeco-button--primary",
                "button[type='submit']"
            ]

            for selector in submit_selectors:
                try:
                    buttons = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for button in buttons:
                        if button.is_displayed() and button.is_enabled():
                            button_text = button.text.lower()
                            if any(word in button_text for word in ['submit', 'envoyer', 'send', 'review', 'suivant', 'next']):
                                button.click()
                                time.sleep(2)
                                logger.debug(f"Bouton '{button.text}' cliqué")
                                return True
                except:
                    continue

            logger.warning("Bouton de soumission non trouvé")
            return False

        except Exception as e:
            logger.error(f"Erreur lors de la soumission: {e}")
            return False

    def _handle_multi_step_form(self, job_data: Dict) -> bool:
        """
        Gère les formulaires multi-étapes Easy Apply

        Args:
            job_data: Données de l'offre

        Returns:
            True si toutes les étapes ont été complétées, False sinon
        """
        max_steps = 10  # Limite de sécurité

        for step in range(max_steps):
            logger.debug(f"Étape {step + 1}/{max_steps} du formulaire")

            # Attendre que le modal soit chargé
            time.sleep(1.5)

            # Vérifier si le modal est toujours présent
            modal = self._get_easy_apply_modal()
            if not modal:
                logger.info("✅ Modal fermé - candidature probablement envoyée")
                return True

            # Remplir le formulaire actuel
            self._fill_form(job_data)
            time.sleep(1)

            # Cliquer sur le bouton primaire (Vérifier/Suivant/Envoyer)
            action = self._click_modal_primary()

            if action == 'submit':
                # Bouton final cliqué (Envoyer/Submit)
                logger.info("✅ Bouton Envoyer cliqué - candidature soumise")
                time.sleep(2)

                # Gérer la popup "Enregistrer cette candidature ?" si elle apparaît
                self._handle_save_application_popup()
                return True

            elif action == 'progress':
                # Bouton intermédiaire cliqué (Vérifier/Suivant/Continuer)
                logger.debug("Passage à l'étape suivante du formulaire")
                time.sleep(1.5)
                continue

            else:
                # Aucun bouton trouvé ou erreur
                logger.warning(f"⚠️ Aucun bouton trouvé à l'étape {step + 1} - tentative alternative")

                # Tentative de fallback avec l'ancienne méthode
                if self._submit_application():
                    time.sleep(1.5)
                    continue
                else:
                    logger.error("❌ Impossible de progresser dans le formulaire")
                    return False

        logger.warning("⚠️ Limite d'étapes atteinte - formulaire incomplet")
        return False

    def _handle_save_application_popup(self):
        """
        Gère la popup "Enregistrer cette candidature ?" qui peut apparaître après fermeture du modal
        """
        try:
            time.sleep(1)
            # Chercher les boutons dans la popup de confirmation
            popup_buttons = [
                "//button[contains(., 'Ignorer')]",  # FR: Ignorer
                "//button[contains(., 'Enregistrer')]",  # FR: Enregistrer
                "//button[contains(., 'Discard')]",  # EN: Discard
                "//button[contains(., 'Save')]",  # EN: Save
            ]

            for xpath in popup_buttons:
                try:
                    btn = self.driver.find_element(By.XPATH, xpath)
                    if btn.is_displayed():
                        # Cliquer sur "Ignorer/Discard" si présent (on ne veut pas sauvegarder le brouillon)
                        if 'ignorer' in btn.text.lower() or 'discard' in btn.text.lower():
                            btn.click()
                            logger.debug("Popup 'Enregistrer cette candidature ?' ignorée")
                            time.sleep(1)
                            return
                except:
                    continue

        except Exception as e:
            logger.debug(f"Pas de popup de sauvegarde ou erreur: {e}")

    def _close_application_modal(self):
        """Ferme le modal de candidature"""
        try:
            close_selectors = [
                "button[aria-label*='Dismiss']",
                "button[aria-label*='Fermer']",
                "button.artdeco-modal__dismiss"
            ]

            for selector in close_selectors:
                try:
                    close_button = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if close_button:
                        close_button.click()
                        time.sleep(1)
                        break
                except:
                    continue

        except Exception as e:
            logger.debug(f"Erreur lors de la fermeture du modal: {e}")

    def apply(self, job_data: Dict) -> bool:
        """
        Effectue une candidature pour une offre

        Args:
            job_data: Dictionnaire avec les données de l'offre

        Returns:
            True si la candidature a réussi, False sinon
        """
        # Vérifier les limites
        if not self._check_limits():
            return False

        try:
            logger.info(f"📝 Candidature pour: {job_data['title']} @ {job_data['company']}")

            # Logger en tant que "queued" avant la tentative
            if self.log_manager:
                self.log_manager.log_application_queued(job_data)

            # Mode dry-run
            if self.config.dry_run:
                logger.info("🔄 MODE DRY-RUN - Candidature simulée")
                if self.log_manager:
                    self.log_manager.log_application_result(job_data, success=True, notes="Dry-run simulation")
                self.applications_today += 1
                self.applications_total += 1
                self._random_delay()
                return True

            # Naviguer vers l'offre
            self.driver.get(job_data['link'])
            time.sleep(3)

            # Cliquer sur Easy Apply
            if not self._click_easy_apply_button():
                if self.log_manager:
                    self.log_manager.log_application_result(job_data, success=False, notes="Bouton Easy Apply non trouvé")
                return False

            # Remplir et soumettre le formulaire
            success = self._handle_multi_step_form(job_data)

            # Fermer le modal
            self._close_application_modal()

            # Logger le résultat
            if self.log_manager:
                notes = "Candidature envoyée" if success else "Formulaire incomplet ou erreur"
                self.log_manager.log_application_result(job_data, success=success, notes=notes)

            if success:
                self.applications_today += 1
                self.applications_total += 1
                logger.info(f"✅ Candidature réussie ({self.applications_today}/{self.config.max_applications_per_day} aujourd'hui)")

            # Délai avant la prochaine candidature
            self._random_delay()

            return success

        except Exception as e:
            logger.error(f"❌ Erreur lors de la candidature: {e}")

            # Prendre une capture d'écran en cas d'erreur
            if self.config.save_screenshots_on_error:
                try:
                    screenshot_path = self.config.output_dir / f"error_{job_data['id']}_{int(time.time())}.png"
                    self.driver.save_screenshot(str(screenshot_path))
                    logger.info(f"Screenshot sauvegardé: {screenshot_path}")
                except:
                    pass

            if self.log_manager:
                self.log_manager.log_application_result(job_data, success=False, notes=f"Erreur: {str(e)}")

            return False
