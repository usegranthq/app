# clear the .next directory
echo "Clearing the .next directory..."
rm -rf .next

# build the application
echo "Building the application..."
npm run build

# prepare the distribution directory
echo "Preparing the distribution directory..."

cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# start the application
echo "Starting the application..."
node .next/standalone/server.js
