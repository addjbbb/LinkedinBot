"""
LinkedIn Auto-Apply Bot - Package principal
Version 2.0 - Refonte complète avec support Firefox, Ollama IA, et config YAML
"""

__version__ = "2.0.0"
__author__ = "LinkedIn Bot Team"

from .config_manager import ConfigManager
from .browser_manager import BrowserManager
from .job_searcher import JobSearcher
from .job_applicator import JobApplicator

__all__ = [
    "ConfigManager",
    "BrowserManager",
    "JobSearcher",
    "JobApplicator",
]
