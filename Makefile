docker-local:
	docker-compose -p melingo-ai-backend -f ./docker-compose.dev.yml up -d --build

docker-local-down:
	docker-compose -p melingo-ai-backend -f ./docker-compose.dev.yml down

docker-build:
	docker-compose -p melingo-ai-backend -f ./docker-compose.dev.yml build

docker-restart:
	docker-compose -p melingo-ai-backend -f ./docker-compose.dev.yml restart

# Main API #	
migrate:
	cd ./sequelize && npx sequelize-cli db:migrate

migrate-redo:
	cd ./sequelize && npx sequelize-cli db:migrate:undo
	make migrate

migrate-fresh:
	cd ./sequelize && npx sequelize-cli db:migrate:undo:all
	make migrate

seed:
	cd ./sequelize && npx sequelize-cli db:seed:all