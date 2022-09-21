# Kubernetes
kb-clean:
	kubectl delete deployment node-example-user-deployment; kubectl delete deployment node-example-routine-deployment; kubectl delete deployment nosqldb-deployment; kubectl delete deployment inmemory-deployment; kubectl delete service node-example-user-service; kubectl delete service node-example-routine-service; kubectl delete service nosqldb-service; kubectl delete service inmemory-service; kubectl delete configmap node-example-env; kubectl delete secret node-example-secret;

kb-apply:
	kubectl apply -f deployment/node-example-user-deployment.yml -f deployment/node-example-routine-deployment.yml -f deployment/nosqldb-deployment.yml -f deployment/inmemory-deployment.yml -f deployment/node-example-user-service.yml -f deployment/node-example-routine-service.yml -f deployment/nosqldb-service.yml -f deployment/inmemory-service.yml -f secrets/env.yml -f secrets/secret.yml

kb-events:
	kubectl get events -w

# DB
populate-db:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers npm run seed -- --type=sql --query=orm
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers npm run seed -- --type=no_sql --query=orm
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleroutines npm run seed

populate-sql-orm:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers npm run seed -- --type=sql --query=orm

populate-sql-raw:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers npm run seed -- --type=sql --query=raw

populate-nosql-orm:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers npm run seed -- --type=no_sql --query=orm

populate-nosql-raw:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers npm run seed -- --type=no_sql --query=raw

populate-inmemory:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleroutines npm run seed

# Config
envs:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers env
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleroutines env

envs-sql:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run sqldb env

envs-nosql:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nosqldb env

envs-inmemory:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run inmemorydb env

app-shell-users:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers sh

app-shell-routines:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleroutines sh

sqldb-shell:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run sqldb bash

nosqldb-shell:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nosqldb bash

inmemorydb-shell:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run inmemorydb bash

# Images & Containers
clean-dist:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers npm run clean
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleroutines npm run clean

build-dist:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers npm run build
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleroutines npm run build

build:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env build
	docker-compose --file docker-compose.yml --env-file ./secrets/.env build

run:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env up

run-db:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env up sqldb nosqldb inmemorydb adminer

run-tests:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers npm test
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleroutines npm test

lint:
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleusers npm run lint
	docker-compose --file docker-compose.yml --env-file ./secrets/.env run nodeexampleroutines npm run lint

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

init: clean build-dist build populate-db run

init-db: clean build-dist build populate-db run-db
