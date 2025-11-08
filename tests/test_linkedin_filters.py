#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tests pour les filtres et la génération d'URLs LinkedIn
"""

import pytest
from src.linkedin_filters import LinkedInFilters


def test_contract_type_mapping():
    """Test que les codes de type de contrat sont corrects"""
    assert LinkedInFilters.CONTRACT_TYPE_CODES["internship"] == "I"
    assert LinkedInFilters.CONTRACT_TYPE_CODES["permanent"] == "F"
    assert LinkedInFilters.CONTRACT_TYPE_CODES["apprenticeship"] == "I"
    assert LinkedInFilters.CONTRACT_TYPE_CODES["fixed-term"] == "C"


def test_seniority_mapping():
    """Test que les codes de niveau d'expérience sont corrects"""
    assert LinkedInFilters.SENIORITY_CODES["internship"] == "1"
    assert LinkedInFilters.SENIORITY_CODES["entry"] == "2"
    assert LinkedInFilters.SENIORITY_CODES["associate"] == "3"
    assert LinkedInFilters.SENIORITY_CODES["mid-senior"] == "4"


def test_work_mode_mapping():
    """Test que les codes de mode de travail sont corrects"""
    assert LinkedInFilters.WORK_MODE_CODES["on-site"] == "1"
    assert LinkedInFilters.WORK_MODE_CODES["remote"] == "2"
    assert LinkedInFilters.WORK_MODE_CODES["hybrid"] == "3"


def test_date_posted_mapping():
    """Test que les codes de date de publication sont corrects"""
    assert LinkedInFilters.DATE_POSTED_CODES["past_24_hours"] == "r86400"
    assert LinkedInFilters.DATE_POSTED_CODES["past_week"] == "r604800"
    assert LinkedInFilters.DATE_POSTED_CODES["past_month"] == "r2592000"


def test_build_search_url_basic():
    """Test la génération d'URL de recherche basique"""
    url = LinkedInFilters.build_search_url(
        keywords="Python Developer",
        location="Paris"
    )

    assert "https://www.linkedin.com/jobs/search/" in url
    assert "keywords=Python" in url
    assert "location=Paris" in url


def test_build_search_url_with_contract_types():
    """Test l'ajout de types de contrat à l'URL"""
    url = LinkedInFilters.build_search_url(
        keywords="Developer",
        location="Paris",
        contract_types=["internship", "permanent"]
    )

    assert "f_JT=I%2CF" in url or "f_JT=I,F" in url.replace("%2C", ",")


def test_build_search_url_with_seniority():
    """Test l'ajout de niveaux d'expérience à l'URL"""
    url = LinkedInFilters.build_search_url(
        keywords="Developer",
        location="Paris",
        seniority_levels=["entry", "associate"]
    )

    assert "f_E=2%2C3" in url or "f_E=2,3" in url.replace("%2C", ",")


def test_build_search_url_with_work_modes():
    """Test l'ajout de modes de travail à l'URL"""
    url = LinkedInFilters.build_search_url(
        keywords="Developer",
        location="Paris",
        work_modes=["remote", "hybrid"]
    )

    assert "f_WT=2%2C3" in url or "f_WT=2,3" in url.replace("%2C", ",")


def test_build_search_url_with_date_posted():
    """Test l'ajout du filtre de date de publication"""
    url = LinkedInFilters.build_search_url(
        keywords="Developer",
        location="Paris",
        date_posted="past_24_hours"
    )

    assert "f_TPR=r86400" in url


def test_build_search_url_with_easy_apply():
    """Test l'ajout du filtre Easy Apply"""
    url = LinkedInFilters.build_search_url(
        keywords="Developer",
        location="Paris",
        easy_apply_only=True
    )

    assert "f_AL=true" in url


def test_build_search_url_with_sort():
    """Test l'ajout du tri par date"""
    url = LinkedInFilters.build_search_url(
        keywords="Developer",
        location="Paris",
        sort_by="date"
    )

    assert "sortBy=DD" in url


def test_build_search_url_complete():
    """Test la génération d'URL avec tous les filtres"""
    url = LinkedInFilters.build_search_url(
        keywords="Python Developer",
        location="Île-de-France",
        contract_types=["internship"],
        seniority_levels=["entry"],
        work_modes=["remote"],
        date_posted="past_week",
        easy_apply_only=True,
        sort_by="date"
    )

    assert "keywords=" in url
    assert "location=" in url
    assert "f_JT=" in url
    assert "f_E=" in url
    assert "f_WT=" in url
    assert "f_TPR=" in url
    assert "f_AL=true" in url
    assert "sortBy=DD" in url


def test_generate_search_urls():
    """Test la génération de multiples URLs de recherche"""
    # Mock ConfigManager
    class MockConfig:
        keywords = ["Python", "Java"]
        locations = ["Paris", "Lyon"]
        contract_types = ["internship"]
        seniority_levels = ["entry"]
        work_modes = ["remote"]
        date_posted = "past_week"
        easy_apply_only = True
        sort_by = "date"

    mock_config = MockConfig()
    urls = LinkedInFilters.generate_search_urls(mock_config)

    # 2 keywords × 2 locations = 4 URLs
    assert len(urls) == 4

    # Vérifier la structure
    assert all('url' in item for item in urls)
    assert all('keyword' in item for item in urls)
    assert all('location' in item for item in urls)

    # Vérifier que les combinaisons sont correctes
    keywords_found = [item['keyword'] for item in urls]
    assert keywords_found.count("Python") == 2
    assert keywords_found.count("Java") == 2
