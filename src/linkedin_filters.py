#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mappings des filtres LinkedIn
Convertit les valeurs lisibles (config.yaml) en codes LinkedIn API
"""

from urllib.parse import urlencode
from typing import List, Dict


class LinkedInFilters:
    """Mappings et construction d'URLs de recherche LinkedIn"""

    # f_JT = Job Type (Type de contrat)
    CONTRACT_TYPE_CODES = {
        "permanent": "F",      # CDI / Full-time
        "fixed-term": "C",     # CDD / Contract
        "part-time": "P",      # Temps partiel
        "temporary": "T",      # Temporaire
        "internship": "I",     # Stage
        "apprenticeship": "I", # Alternance (même code que stage)
        "volunteer": "V",      # Bénévolat
        "other": "O",          # Autre
    }

    # f_E = Experience Level (Niveau d'expérience)
    SENIORITY_CODES = {
        "internship": "1",     # Stage
        "entry": "2",          # Débutant / Entry level
        "associate": "3",      # Intermédiaire / Associate
        "mid-senior": "4",     # Confirmé / Mid-Senior
        "director": "5",       # Directeur
        "executive": "6",      # Cadre dirigeant
    }

    # f_WT = Work Type (Mode de travail)
    WORK_MODE_CODES = {
        "on-site": "1",        # Sur place
        "remote": "2",         # Télétravail
        "hybrid": "3",         # Hybride
    }

    # f_TPR = Time Period Range (Date de publication)
    DATE_POSTED_CODES = {
        "past_24_hours": "r86400",     # Dernières 24h
        "past_week": "r604800",        # 7 derniers jours
        "past_month": "r2592000",      # 30 derniers jours
        "any": "",                     # N'importe quand
    }

    # sortBy (Tri)
    SORT_BY_CODES = {
        "date": "DD",          # Date (récent)
        "relevance": "R",      # Pertinence
    }

    BASE_URL = "https://www.linkedin.com/jobs/search/"

    @staticmethod
    def build_search_url(
        keywords: str,
        location: str,
        contract_types: List[str] = None,
        seniority_levels: List[str] = None,
        work_modes: List[str] = None,
        date_posted: str = "any",
        sort_by: str = "date",
        easy_apply_only: bool = True,
        page: int = 0
    ) -> str:
        """
        Construit une URL de recherche LinkedIn complète

        Args:
            keywords: Mots-clés de recherche
            location: Localisation
            contract_types: Liste des types de contrat
            seniority_levels: Liste des niveaux d'expérience
            work_modes: Liste des modes de travail
            date_posted: Date de publication
            sort_by: Tri (date ou relevance)
            easy_apply_only: Filtrer Easy Apply uniquement
            page: Numéro de page (commence à 0)

        Returns:
            URL complète de recherche
        """
        params = {
            'keywords': keywords,
            'location': location,
            'start': page * 25  # LinkedIn: 25 résultats/page
        }

        # Type de contrat (f_JT)
        if contract_types:
            codes = [LinkedInFilters.CONTRACT_TYPE_CODES.get(ct) for ct in contract_types]
            codes = [c for c in codes if c]  # Filtrer None
            if codes:
                params['f_JT'] = ','.join(codes)

        # Niveau d'expérience (f_E)
        if seniority_levels:
            codes = [LinkedInFilters.SENIORITY_CODES.get(sl) for sl in seniority_levels]
            codes = [c for c in codes if c]
            if codes:
                # Dédupliquer
                params['f_E'] = ','.join(sorted(set(codes)))

        # Mode de travail (f_WT)
        if work_modes:
            codes = [LinkedInFilters.WORK_MODE_CODES.get(wm) for wm in work_modes]
            codes = [c for c in codes if c]
            if codes:
                params['f_WT'] = ','.join(codes)

        # Date de publication (f_TPR)
        date_code = LinkedInFilters.DATE_POSTED_CODES.get(date_posted, "")
        if date_code:
            params['f_TPR'] = date_code

        # Tri (sortBy)
        sort_code = LinkedInFilters.SORT_BY_CODES.get(sort_by, "DD")
        params['sortBy'] = sort_code

        # Easy Apply uniquement (f_AL)
        if easy_apply_only:
            params['f_AL'] = 'true'

        return LinkedInFilters.BASE_URL + "?" + urlencode(params)

    @staticmethod
    def generate_search_urls(config_manager) -> List[Dict]:
        """
        Génère toutes les combinaisons d'URLs depuis ConfigManager

        Args:
            config_manager: Instance de ConfigManager

        Returns:
            Liste de dicts avec {url, keyword, location}
        """
        urls = []

        for keyword in config_manager.keywords:
            for location in config_manager.locations:
                url = LinkedInFilters.build_search_url(
                    keywords=keyword,
                    location=location,
                    contract_types=config_manager.contract_types,
                    seniority_levels=config_manager.seniority_levels,
                    work_modes=config_manager.work_modes,
                    date_posted=config_manager.date_posted,
                    sort_by=config_manager.sort_by,
                    easy_apply_only=config_manager.easy_apply_only,
                    page=0
                )

                urls.append({
                    'url': url,
                    'keyword': keyword,
                    'location': location,
                })

        return urls


if __name__ == "__main__":
    # Test
    url = LinkedInFilters.build_search_url(
        keywords="stage informatique",
        location="Paris",
        contract_types=["internship"],
        seniority_levels=["internship", "entry"],
        work_modes=["remote", "hybrid"],
        date_posted="past_week",
        sort_by="date",
        easy_apply_only=True
    )
    print(f"URL générée:\n{url}")
