
# Node-example Backend

A POC for an Express app with good practices and up-to-date stack.



## Features

- Typescript
- Docker
- Kubernetes
- SQL DB: Postgres
- NO-SQL DB: Mongo
- In Memory DB / Cache: Redis
- Linter
- Testing: Supertest, chai, sinon
- Yargs
- i18n
## API Reference

#### Login
```http
  POST /api/v1/sign-in
```
Body example:
```
    {
        "email": "victorio.matteucci@foo.com",
        "password": "password"
    }
```

#### Get all users
```http
  GET /api/v1/users
```

#### Get user by id
```http
  GET /api/v1/users/<uuid>
```

#### Create user
```http
  POST /api/v1/users/sign-up
```
Body example:
```
    {
        "firstName": "foo",
        "lastName": "bar",
        "email": "foo@gbar.com",
        "role": "user|admin",
        "password": "password"
    }
```

#### Edit user by id (requires authentication)
```http
  PUT /api/v1/users/<uuid>
```
Body example:
```
    {
        "firstName": "foo",
        "lastName": "bar",
        "email": "foo@gbar.com",
        "role": "user|admin",
        "password": "password"
    }
```

#### Delete user by id (requires authentication)
```http
  DELETE /api/v1/users/<uuid>
```


## Authors

- Victorio Matteucci: [@fitu](https://www.github.com/fitu)


## Installation

#### Local (for development)
Use make for downloading the images and run them.
Check Makefile for extra documentation.

```bash
  make init
```
    
## Deployment (kubernetes)

To deploy this project using Kubernetes.

You should configure the environment (minikube / AWS EKS) before running this commands.

Note: It only works with a no-sql db (mongodb image) as another POD

#### Build the image
```bash
  docker build -t <repo>/node-example:latest .
```

#### Publish the image
```bash
  docker push <repo>/node-example:latest
```

#### Apply files
```bash
  kubectl apply -f deployment/node-example-deployment.yml -f deployment/nosqldb-deployment.yml -f deployment/nosqldb-service.yml -f secrets/env.yml -f secrets/secret.yml
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

