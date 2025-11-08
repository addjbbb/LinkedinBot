.PHONY: install run test lint clean help

help:  ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install:  ## Installe les dépendances
	pip install -r requirements.txt

run:  ## Lance le bot avec config.yaml
	python src/main.py

run-dry:  ## Lance le bot en mode dry-run (simulation)
	@echo "⚠️  Mode DRY-RUN - aucune candidature réelle"
	python src/main.py --dry-run

test:  ## Lance les tests
	pytest tests/ -v --cov=src --cov-report=html

test-config:  ## Test uniquement du chargement de config
	python src/config_manager.py

lint:  ## Vérifie le code (black, flake8)
	black src/ tests/ --check
	flake8 src/ tests/ --max-line-length=120

format:  ## Formate le code automatiquement
	black src/ tests/

clean:  ## Nettoie les fichiers temporaires
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache htmlcov .coverage

validate-config:  ## Valide la configuration sans lancer le bot
	python -c "from src.config_manager import ConfigManager; c = ConfigManager(); c.print_summary()"

check-ollama:  ## Vérifie qu'Ollama est accessible
	@curl -s http://localhost:11434/api/tags | jq '.models[].name' || echo "❌ Ollama non accessible"
