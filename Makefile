# make file for development

# load environment variables
include .env.development
export

auth-gen:
	npx @better-auth/cli@latest generate

lint-staged:
	npx lint-staged

dev:
	npm run dev

build:
	npm run build

db:
	npm run db

migrate:
	npm run migrate:dev

studio:
	npm run studio

test:
	npm run test

clear:
	@read -p "Are you sure you want to clear the database? (y/n): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		docker compose down -v --remove-orphans; \
	else \
		echo "Operation cancelled."; \
	fi
