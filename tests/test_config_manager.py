#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tests pour le gestionnaire de configuration
"""

import pytest
import os
import tempfile
import yaml
from pathlib import Path
from src.config_manager import ConfigManager


@pytest.fixture
def temp_config_file():
    """Crée un fichier de configuration temporaire pour les tests"""
    config_data = {
        "auth": {
            "linkedin_email": "test@example.com",
            "linkedin_password": "testpassword123",
            "profile_choice": {
                "browser": "firefox",
                "firefox_profile_path": None
            }
        },
        "search": {
            "keywords": ["test job"],
            "locations": ["Paris"],
            "contract_types": ["internship"],
            "seniority_levels": ["entry"],
            "work_modes": ["remote"],
            "date_posted": "past_week",
            "sort_by": "date",
            "easy_apply_only": True,
            "pages_to_scan": 2
        },
        "apply": {
            "max_applications_per_day": 10,
            "max_applications_total": 50,
            "delay_between_applications_seconds": [5, 10],
            "timeout_seconds": 30,
            "forbidden_hours": [],
            "message_to_recruiter": "Test message",
            "ai_answers": {
                "enable": False,
                "provider": "ollama",
                "model": "llama3.1:8b",
                "ollama_base_url": "http://localhost:11434"
            }
        },
        "logging": {
            "output_dir": "runs",
            "save_json_applied": True,
            "json_filename": "test_log.json",
            "save_screenshots_on_error": False,
            "log_level": "INFO"
        },
        "safety": {
            "dry_run": True,
            "show_browser": False
        }
    }

    with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
        yaml.dump(config_data, f)
        temp_path = f.name

    yield temp_path

    # Cleanup
    os.unlink(temp_path)


def test_config_loads_successfully(temp_config_file):
    """Test que la configuration se charge correctement"""
    config = ConfigManager(config_path=temp_config_file)
    assert config.linkedin_email == "test@example.com"
    assert config.dry_run is True


def test_config_property_accessors(temp_config_file):
    """Test que les propriétés sont accessibles"""
    config = ConfigManager(config_path=temp_config_file)

    # Auth
    assert config.linkedin_email == "test@example.com"
    assert config.linkedin_password == "testpassword123"
    assert config.browser == "firefox"

    # Search
    assert "test job" in config.keywords
    assert "Paris" in config.locations
    assert config.pages_to_scan == 2

    # Apply
    assert config.max_applications_per_day == 10
    assert config.max_applications_total == 50
    assert config.ai_enabled is False

    # Logging
    assert config.log_level == "INFO"

    # Safety
    assert config.dry_run is True
    assert config.show_browser is False


def test_config_env_variable_expansion(temp_config_file):
    """Test l'expansion des variables d'environnement"""
    # Définir une variable d'environnement
    os.environ['TEST_EMAIL'] = 'env@example.com'

    # Créer un config avec une variable d'environnement
    config_data = {
        "auth": {
            "linkedin_email": "${TEST_EMAIL}",
            "linkedin_password": "password",
            "profile_choice": {"browser": "firefox"}
        },
        "search": {
            "keywords": ["test"],
            "locations": ["Paris"],
            "contract_types": ["internship"],
            "seniority_levels": ["entry"],
            "work_modes": ["remote"],
            "date_posted": "past_week",
            "sort_by": "date",
            "easy_apply_only": True,
            "pages_to_scan": 1
        },
        "apply": {
            "max_applications_per_day": 10,
            "max_applications_total": 50,
            "delay_between_applications_seconds": [5, 10],
            "timeout_seconds": 30,
            "forbidden_hours": [],
            "ai_answers": {
                "enable": False,
                "provider": "ollama",
                "model": "llama3.1:8b"
            }
        },
        "logging": {
            "output_dir": "runs",
            "save_json_applied": True,
            "json_filename": "test.json",
            "save_screenshots_on_error": False,
            "log_level": "INFO"
        },
        "safety": {
            "dry_run": True,
            "show_browser": False
        }
    }

    with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
        yaml.dump(config_data, f)
        temp_path = f.name

    try:
        config = ConfigManager(config_path=temp_path)
        assert config.linkedin_email == 'env@example.com'
    finally:
        os.unlink(temp_path)
        del os.environ['TEST_EMAIL']


def test_config_validation_requires_fields(temp_config_file):
    """Test que la validation détecte les champs manquants"""
    # Créer une config invalide (champ auth manquant)
    invalid_config = {
        "search": {
            "keywords": ["test"],
            "locations": ["Paris"],
            "contract_types": ["internship"],
            "seniority_levels": ["entry"],
            "work_modes": ["remote"],
            "date_posted": "past_week",
            "sort_by": "date",
            "easy_apply_only": True,
            "pages_to_scan": 1
        }
    }

    with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
        yaml.dump(invalid_config, f)
        temp_path = f.name

    try:
        with pytest.raises(Exception):  # Devrait lever une erreur de validation
            ConfigManager(config_path=temp_path)
    finally:
        os.unlink(temp_path)


def test_output_dir_creation(temp_config_file):
    """Test que le répertoire de sortie est créé"""
    config = ConfigManager(config_path=temp_config_file)
    assert config.output_dir.exists()
    assert config.output_dir.is_dir()
