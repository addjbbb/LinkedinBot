#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LinkedIn Helpers - Utilitaires et mappings pour le bot LinkedIn
Inspiré des meilleures pratiques du scraper
"""

import random
import time
import math
from typing import List, Dict, Tuple
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement


class LinkedInMapper:
    """
    Gère les mappings entre valeurs françaises/anglaises et codes LinkedIn
    Permet une configuration plus intuitive
    """

    # Mappings des filtres LinkedIn (f_JT = Job Type)
    TYPE_EMPLOI = {
        "Full-time": "F",
        "Temps plein": "F",
        "CDI": "F",
        "Part-time": "P",
        "Temps partiel": "P",
        "Contract": "C",
        "CDD": "C",
        "Contrat": "C",
        "Temporary": "T",
        "Freelance": "T",
        "Temporaire": "T",
        "Volunteer": "V",
        "Bénévolat": "V",
        "Interim": "V",
        "Internship": "I",
        "Stage": "I",
        "Alternance": "I",
        "Other": "O",
        "Autre": "O"
    }

    # f_E = Experience Level
    NIVEAU_EXPERIENCE = {
        "Internship": "1",
        "Stage": "1",
        "Entry level": "2",
        "Débutant": "2",
        "Associate": "3",
        "Intermédiaire": "3",
        "Mid-Senior level": "4",
        "Confirmé": "4",
        "Senior": "4",
        "Director": "5",
        "Directeur": "5",
        "Executive": "6",
        "Cadre dirigeant": "6"
    }

    # f_WT = Work Type (mode de travail)
    MODE_TRAVAIL = {
        "On-site": "1",
        "Sur place": "1",
        "Présentiel": "1",
        "Hybrid": "2",
        "Hybride": "2",
        "Remote": "3",
        "Télétravail": "3",
        "Distance": "3"
    }

    # f_TPR = Time Period Range
    DATE_PUBLICATION = {
        "Past 24 hours": "r86400",
        "24h": "r86400",
        "Past Week": "r604800",
        "Dernière semaine": "r604800",
        "Past Month": "r2592000",
        "Dernier mois": "r2592000",
        "Any Time": "",
        "N'importe quand": ""
    }

    # Salaires (f_SB2)
    SALAIRES = {
        "$40,000+": "1",
        "$60,000+": "2",
        "$80,000+": "3",
        "$100,000+": "4",
        "$120,000+": "5",
        "$140,000+": "6",
        "$160,000+": "7",
        "$180,000+": "8",
        "$200,000+": "9"
    }

    # Tri (sortBy)
    TRI = {
        "Recent": "DD",
        "Récent": "DD",
        "Relevant": "R",
        "Pertinent": "R"
    }

    # GeoIDs des continents
    CONTINENTS = {
        "Europe": "100506914",
        "Asia": "102393603",
        "NorthAmerica": "102221843",
        "SouthAmerica": "104514572",
        "Australia": "101452733",
        "Africa": "103537801"
    }

    @staticmethod
    def get_code(mapping: Dict[str, str], key: str) -> str:
        """
        Récupère le code LinkedIn d'une valeur (case-insensitive)

        Args:
            mapping: Dictionnaire de mapping
            key: Clé à rechercher

        Returns:
            Code LinkedIn ou None
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

    @staticmethod
    def get_job_type_code(job_type: str) -> str:
        """Récupère le code pour un type d'emploi"""
        return LinkedInMapper.get_code(LinkedInMapper.TYPE_EMPLOI, job_type)

    @staticmethod
    def get_experience_code(level: str) -> str:
        """Récupère le code pour un niveau d'expérience"""
        return LinkedInMapper.get_code(LinkedInMapper.NIVEAU_EXPERIENCE, level)

    @staticmethod
    def get_work_type_code(work_type: str) -> str:
        """Récupère le code pour un mode de travail"""
        return LinkedInMapper.get_code(LinkedInMapper.MODE_TRAVAIL, work_type)

    @staticmethod
    def get_date_code(date: str) -> str:
        """Récupère le code pour une date de publication"""
        return LinkedInMapper.get_code(LinkedInMapper.DATE_PUBLICATION, date)

    @staticmethod
    def get_salary_code(salary: str) -> str:
        """Récupère le code pour un salaire"""
        return LinkedInMapper.get_code(LinkedInMapper.SALAIRES, salary)

    @staticmethod
    def get_sort_code(sort: str) -> str:
        """Récupère le code pour le tri"""
        return LinkedInMapper.get_code(LinkedInMapper.TRI, sort)

    @staticmethod
    def get_continent_code(continent: str) -> str:
        """Récupère le geoId pour un continent"""
        return LinkedInMapper.get_code(LinkedInMapper.CONTINENTS, continent)


class URLGenerator:
    """Génère des URLs de recherche LinkedIn avec tous les filtres"""

    BASE_URL = "https://www.linkedin.com/jobs/search/"

    def __init__(self, config_loader):
        """
        Initialise le générateur d'URLs

        Args:
            config_loader: Instance de ConfigLoader
        """
        self.config = config_loader
        self.mapper = LinkedInMapper()

    def generate_urls(self) -> List[str]:
        """
        Génère toutes les combinaisons d'URLs de recherche
        basées sur les paramètres de configuration

        Returns:
            Liste d'URLs complètes
        """
        urls = []
        locations = self.config.get_locations()
        keywords = self.config.get_keywords()

        # Générer une URL par combinaison localisation × mot-clé
        for location in locations:
            for keyword in keywords:
                url = self._build_url(keyword, location)
                urls.append(url)

        return urls

    def _build_url(self, keyword: str, location: str) -> str:
        """
        Construit une URL de recherche complète

        Args:
            keyword: Mot-clé de recherche
            location: Localisation

        Returns:
            URL complète avec tous les filtres
        """
        params = []

        # Recherche de base
        params.append(f"keywords={self._encode(keyword)}")

        # Localisation + geoId si continent
        location_param = f"location={self._encode(location)}"
        geo_id = self.mapper.get_continent_code(location)
        if geo_id:
            location_param += f"&geoId={geo_id}"
        params.append(location_param)

        # Distance
        distance = self.config.get('recherche', 'distance_km', default='25')
        if distance:
            params.append(f"distance={distance}")

        # Easy Apply
        if self.config.get('filtres', 'easy_apply_uniquement', default=False):
            params.append("f_AL=true")

        # Niveau d'expérience (f_E)
        experience_levels = self.config.get_experience_levels()
        if experience_levels:
            codes = []
            for level in experience_levels:
                code = self.mapper.get_experience_code(level)
                if code:
                    codes.append(code)
            if codes:
                params.append(f"f_E={','.join(set(codes))}")

        # Type d'emploi (f_JT)
        job_types = self.config.get_job_types()
        if job_types:
            codes = []
            for jt in job_types:
                code = self.mapper.get_job_type_code(jt)
                if code:
                    codes.append(code)
            if codes:
                params.append(f"f_JT={','.join(set(codes))}")

        # Mode de travail (f_WT)
        remote_types = self.config.get_remote_types()
        if remote_types:
            codes = []
            for rt in remote_types:
                code = self.mapper.get_work_type_code(rt)
                if code:
                    codes.append(code)
            if codes:
                params.append(f"f_WT={','.join(set(codes))}")

        # Date de publication (f_TPR)
        date_posted = self.config.get_date_posted()
        date_code = self.mapper.get_date_code(date_posted)
        if date_code:
            params.append(f"f_TPR={date_code}")

        # Salaire (f_SB2)
        salary = self.config.get_salary()
        salary_code = self.mapper.get_salary_code(salary)
        if salary_code:
            params.append(f"f_SB2={salary_code}")

        # Tri (sortBy)
        sort = self.config.get_sort()
        sort_code = self.mapper.get_sort_code(sort)
        if sort_code:
            params.append(f"sortBy={sort_code}")

        # Construire l'URL finale
        url = self.BASE_URL + "?" + "&".join(params)
        return url

    @staticmethod
    def _encode(text: str) -> str:
        """Encode un texte pour URL (remplace espaces par +)"""
        return text.replace(' ', '+')


class SmartDelay:
    """
    Gère les délais intelligents pour éviter la détection
    Utilise des distributions aléatoires réalistes
    """

    @staticmethod
    def between_applications(config_loader):
        """
        Délai entre deux candidatures

        Args:
            config_loader: Instance de ConfigLoader
        """
        min_delay, max_delay = config_loader.get_delay_between_applications()
        delay = random.uniform(min_delay, max_delay)
        time.sleep(delay)

    @staticmethod
    def between_pages(min_sec: float = 2, max_sec: float = 5):
        """
        Délai entre deux pages de résultats

        Args:
            min_sec: Délai minimum
            max_sec: Délai maximum
        """
        delay = random.uniform(min_sec, max_sec)
        time.sleep(delay)

    @staticmethod
    def short_pause(min_sec: float = 0.5, max_sec: float = 2):
        """
        Courte pause (ex: entre deux clics)

        Args:
            min_sec: Délai minimum
            max_sec: Délai maximum
        """
        delay = random.uniform(min_sec, max_sec)
        time.sleep(delay)

    @staticmethod
    def human_like_delay(min_sec: float = 2, max_sec: float = 5):
        """
        Délai avec distribution normale (plus réaliste)

        Args:
            min_sec: Minimum
            max_sec: Maximum
        """
        mean = (min_sec + max_sec) / 2
        std_dev = (max_sec - min_sec) / 4
        delay = random.normalvariate(mean, std_dev)
        # S'assurer que le délai reste dans les bornes
        delay = max(min_sec, min(max_sec, delay))
        time.sleep(delay)


class RobustElementFinder:
    """
    Recherche robuste d'éléments avec sélecteurs multiples
    Inspiré du scraper
    """

    @staticmethod
    def find_with_alternatives(
        parent,
        selectors: List[Tuple],
        timeout: int = 5
    ) -> WebElement:
        """
        Cherche un élément avec plusieurs sélecteurs alternatifs

        Args:
            parent: Élément parent ou driver
            selectors: Liste de tuples (By.X, 'selector')
            timeout: Temps d'attente max

        Returns:
            WebElement ou None
        """
        for by, selector in selectors:
            try:
                element = parent.find_element(by, selector)
                if element:
                    return element
            except:
                continue
        return None

    @staticmethod
    def safe_get_text(element: WebElement, default: str = "N/A") -> str:
        """
        Récupère le texte d'un élément de manière sécurisée

        Args:
            element: Élément Selenium
            default: Valeur par défaut si erreur

        Returns:
            Texte de l'élément ou default
        """
        try:
            if element:
                return element.text.strip()
        except:
            pass
        return default

    @staticmethod
    def safe_click(element: WebElement) -> bool:
        """
        Clique sur un élément de manière sécurisée

        Args:
            element: Élément à cliquer

        Returns:
            True si succès, False sinon
        """
        try:
            if element:
                element.click()
                return True
        except:
            pass
        return False


class StatisticsTracker:
    """Suivi des statistiques de candidature"""

    def __init__(self):
        self.total_jobs_visited = 0
        self.total_applications_sent = 0
        self.total_already_applied = 0
        self.total_blacklisted = 0
        self.total_failed = 0
        self.applications_by_company = {}
        self.start_time = time.time()

    def increment_visited(self):
        """Incrémente le compteur d'offres visitées"""
        self.total_jobs_visited += 1

    def increment_applied(self, company: str = "Unknown"):
        """Incrémente le compteur de candidatures envoyées"""
        self.total_applications_sent += 1
        self.applications_by_company[company] = \
            self.applications_by_company.get(company, 0) + 1

    def increment_already_applied(self):
        """Incrémente le compteur de déjà postulé"""
        self.total_already_applied += 1

    def increment_blacklisted(self):
        """Incrémente le compteur de blacklistés"""
        self.total_blacklisted += 1

    def increment_failed(self):
        """Incrémente le compteur d'échecs"""
        self.total_failed += 1

    def get_duration_minutes(self) -> int:
        """Retourne la durée d'exécution en minutes"""
        return int((time.time() - self.start_time) / 60)

    def get_success_rate(self) -> float:
        """Calcule le taux de réussite"""
        if self.total_jobs_visited == 0:
            return 0.0
        return (self.total_applications_sent / self.total_jobs_visited) * 100

    def print_summary(self):
        """Affiche un résumé des statistiques"""
        print("\n" + "=" * 80)
        print("📊 STATISTIQUES DE LA SESSION")
        print("=" * 80)
        print(f"\n⏱️  Durée: {self.get_duration_minutes()} minute(s)")
        print(f"👀 Offres visitées: {self.total_jobs_visited}")
        print(f"✅ Candidatures envoyées: {self.total_applications_sent}")
        print(f"♻️  Déjà postulé: {self.total_already_applied}")
        print(f"🚫 Blacklistées: {self.total_blacklisted}")
        print(f"❌ Échecs: {self.total_failed}")
        print(f"📈 Taux de réussite: {self.get_success_rate():.1f}%")

        if self.applications_by_company:
            print(f"\n🏢 Top 5 entreprises:")
            top_companies = sorted(
                self.applications_by_company.items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]
            for i, (company, count) in enumerate(top_companies, 1):
                print(f"   {i}. {company}: {count} candidature(s)")

        print("=" * 80)


# Utilitaires divers
def jobs_to_pages(num_jobs_text: str, jobs_per_page: int = 25) -> int:
    """
    Convertit un texte "X results" en nombre de pages

    Args:
        num_jobs_text: Texte LinkedIn (ex: "1,234 results")
        jobs_per_page: Nombre d'emplois par page

    Returns:
        Nombre de pages (max 40 pour éviter les abus)
    """
    try:
        # Extraire le nombre (enlever virgules et texte)
        num_text = num_jobs_text.split()[0]
        num_jobs = int(num_text.replace(',', ''))
        num_pages = math.ceil(num_jobs / jobs_per_page)
        # LinkedIn limite à 1000 résultats (40 pages × 25)
        return min(num_pages, 40)
    except:
        return 1
