#!/bin/sh
set -e

# Install jq (since alpine doesn't have it)
apk add --no-cache jq

# Extract version from package.json
PRISMA_VERSION=$(jq -r '.devDependencies.prisma // empty | sub("^[^0-9]*"; "")' package.json)

echo "Using Prisma version $PRISMA_VERSION"

npm i -g prisma@$PRISMA_VERSION

npx prisma migrate deploy
