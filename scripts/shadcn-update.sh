#! /bin/bash

# Handle Ctrl+C
trap "echo -e '\nProcess interrupted by user. Exiting...'; exit 1" SIGINT

for file in src/shadcn/components/ui/*.tsx; do
  npx shadcn@latest add -y -o $(basename "$file" .tsx)
done

echo -e '\nShadcn UI components update completed.'
