#! /bin/bash

for file in src/components/ui/*.tsx; do
  npx shadcn@latest add -y -o $(basename "$file" .tsx)
done
