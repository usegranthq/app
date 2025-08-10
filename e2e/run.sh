#!/bin/bash

# run docker if not in CI
if [ "$CI" != "true" ]; then
  # check and stop any existing container
  if [ "$(docker ps -q -f name=uge2epg)" ]; then
    docker stop uge2epg
    docker rm uge2epg
  fi

  docker run --name uge2epg \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=ugdb \
    -p 5433:5432 \
    -d postgres:alpine
  export DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ugdb

  # wait for postgres to be ready
  sleep 5
fi

# check if the DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is not set"
  exit 1
fi

# run the migration
npm run migrate:dev

# seed the database
npm run seed:e2e

# run the hurl test from e2e directory
cd "$(dirname "$0")"

npm run sdk:e2e

# stop the docker container
if [ "$CI" != "true" ]; then
  docker stop uge2epg
  docker rm uge2epg
fi
