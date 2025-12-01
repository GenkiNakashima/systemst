.PHONY: help up down dev build logs restart clean migrate seed install

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
dev: ## Start development environment with hot-reload
	docker-compose -f docker-compose.dev.yml up -d

dev-logs: ## View development environment logs
	docker-compose -f docker-compose.dev.yml logs -f

dev-down: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down

# Production commands
up: ## Start production environment
	docker-compose up -d

down: ## Stop production environment
	docker-compose down

build: ## Build all containers
	docker-compose build

logs: ## View logs
	docker-compose logs -f

restart: ## Restart all services
	docker-compose restart

# Backend commands
migrate: ## Run database migrations
	docker-compose exec backend php artisan migrate

migrate-fresh: ## Fresh migrate with seed
	docker-compose exec backend php artisan migrate:fresh --seed

seed: ## Run database seeders
	docker-compose exec backend php artisan db:seed

backend-shell: ## Access backend container shell
	docker-compose exec backend bash

backend-install: ## Install backend dependencies
	docker-compose exec backend composer install

# Frontend commands
frontend-shell: ## Access frontend container shell
	docker-compose exec frontend sh

frontend-install: ## Install frontend dependencies
	docker-compose exec frontend npm install

# Database commands
db-shell: ## Access database shell
	docker-compose exec db psql -U deepdive_user -d deepdive_dev

# Cleanup commands
clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all

clean-volumes: ## Remove all volumes (data will be lost)
	docker-compose down -v

# Initial setup
install: ## Initial setup for development
	@echo "Setting up development environment..."
	cp backend/.env.example backend/.env
	cp frontend/.env.example frontend/.env.local
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Waiting for services to start..."
	sleep 10
	docker-compose -f docker-compose.dev.yml exec backend composer install
	docker-compose -f docker-compose.dev.yml exec backend php artisan key:generate
	docker-compose -f docker-compose.dev.yml exec backend php artisan migrate --seed
	docker-compose -f docker-compose.dev.yml exec frontend npm install
	@echo "Setup complete! Access http://localhost:3000"
