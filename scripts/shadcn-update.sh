#! /bin/bash

# Handle Ctrl+C gracefully
trap "echo -e '\nProcess interrupted by user. Exiting...'; exit 1" SIGINT

shadcn_dir="src/shadcn/components/ui"

if [ ! -d "$shadcn_dir" ]; then
  echo "Directory $shadcn_dir does not exist. Exiting."
  exit 1
fi

found=0
for file in "$shadcn_dir"/*.tsx; do
  if [ -f "$file" ]; then
    found=1
    component_name="$(basename "$file" .tsx)"
    echo "Updating component: $component_name"
    npx shadcn@latest add -y -o "$component_name"
  fi
done

if [ $found -eq 0 ]; then
  echo "No .tsx components found in $shadcn_dir."
fi

echo -e '\nShadcn UI components update completed.'
