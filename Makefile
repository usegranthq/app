# make file for development

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
	docker compose down -v --remove-orphans
