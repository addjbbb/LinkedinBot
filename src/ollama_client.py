#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Client Ollama pour réponses IA aux questions de recrutement
"""

import logging
import requests
from typing import Optional

logger = logging.getLogger(__name__)


class OllamaClient:
    """Client pour communiquer avec Ollama local"""

    def __init__(self, config_manager):
        """
        Initialise le client Ollama

        Args:
            config_manager: Instance de ConfigManager
        """
        self.config = config_manager
        self.base_url = config_manager.ollama_base_url
        self.model = config_manager.ai_model
        self.prompt_prefix = config_manager.get('apply', 'ai_answers', 'prompt_prefix', default='')
        self.enabled = config_manager.ai_enabled

        if self.enabled:
            self._check_ollama_availability()

    def _check_ollama_availability(self):
        """Vérifie qu'Ollama est accessible"""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            if response.status_code == 200:
                models = response.json().get('models', [])
                model_names = [m['name'] for m in models]
                if self.model in model_names or any(self.model in name for name in model_names):
                    logger.info(f"✅ Ollama disponible - Modèle: {self.model}")
                else:
                    logger.warning(f"⚠️  Modèle {self.model} non trouvé dans Ollama. Modèles disponibles: {model_names}")
            else:
                raise ConnectionError(f"Status code: {response.status_code}")
        except Exception as e:
            logger.error(f"❌ Ollama non accessible: {e}")
            self.enabled = False

    def generate_answer(self, question: str, job_context: dict = None) -> Optional[str]:
        """
        Génère une réponse à une question via Ollama

        Args:
            question: Question posée
            job_context: Contexte du poste (titre, entreprise, description)

        Returns:
            Réponse générée ou None si erreur
        """
        if not self.enabled:
            return None

        # Construire le prompt
        prompt_parts = []
        if self.prompt_prefix:
            prompt_parts.append(self.prompt_prefix)

        if job_context:
            prompt_parts.append(f"\nContexte du poste:")
            if job_context.get('title'):
                prompt_parts.append(f"- Titre: {job_context['title']}")
            if job_context.get('company'):
                prompt_parts.append(f"- Entreprise: {job_context['company']}")

        prompt_parts.append(f"\nQuestion: {question}")
        prompt_parts.append("\nRéponse:")

        prompt = "\n".join(prompt_parts)

        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "max_tokens": self.config.get('apply', 'ai_answers', 'max_tokens', default=150)
                    }
                },
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                answer = result.get('response', '').strip()
                logger.debug(f"🤖 IA - Q: {question[:50]}... | A: {answer[:100]}...")
                return answer
            else:
                logger.error(f"❌ Ollama erreur: {response.status_code}")
                return None

        except Exception as e:
            logger.error(f"❌ Erreur génération IA: {e}")
            return None
