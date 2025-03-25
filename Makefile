# make file for development

# load environment variables
include .env.development
export

dev:
	npm run dev

build:
	npm run build

db:
	docker compose up

dbd:
	docker compose down

migrate:
	npm run migrate:dev

clear:
	@read -p "Are you sure you want to clear the database? (y/n): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		docker compose down -v --remove-orphans; \
	else \
		echo "Operation cancelled."; \
	fi
