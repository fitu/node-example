# DB
# Run: docker-compose run --file docker-compose.yml --env-file ./secrets/.env nodeexample npm run seed -- -h
# To see possible db type's and querie's arguments
populate-db:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run seed -- --type=sql --query=orm
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run seed -- --type=no_sql --query=orm
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run seed -- --type=in_memory

populate-sql-orm:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run seed -- --type=sql --query=orm

populate-sql-raw:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run seed -- --type=sql --query=raw

populate-nosql-orm:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run seed -- --type=no_sql --query=orm

populate-nosql-raw:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run seed -- --type=no_sql --query=raw

populate-inmemory:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run seed -- --type=in_memory

# Config
envs:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample env

envs-sql:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run sqldb env

envs-nosql:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nosqldb env

envs-inmemory:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run inmemorydb env

app-shell:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample sh

sqldb-shell:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run sqldb bash

nosqldb-shell:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nosqldb bash

inmemorydb-shell:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run inmemorydb bash

# Images & Containers
clean-dist:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run clean

build-dist:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run build

build:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env build

run:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env up

run-db:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env up sqldb nosqldb inmemorydb adminer

run-tests:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm test

lint:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexample npm run lint

watch-logs:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env logs

stop:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env stop

# It also removes the stopped containers as well as any networks that were created
down:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env -v --remove-orphans down

remove:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env --force --stop -v rm 

clean: stop down remove

init: clean clean-dist build-dist build populate-db run

init-db: clean clean-dist build-dist build populate-db run-db
