#!/bin/sh

set -e

echo "Starting cron script..."

# check if CRON_SECRET is set
if [ -z "${CRON_SECRET}" ]; then
  echo "CRON_SECRET is not set. Please set it before running this script."
  exit 1
fi

# check if CRON_URL is set
if [ -z "${CRON_URL}" ]; then
  echo "CRON_URL is not set. Please set it before running this script."
  exit 1
fi

# send curl
echo "0 */2 * * * curl -H 'Authorization: Bearer ${CRON_SECRET}' ${CRON_URL}" > /etc/crontabs/root

# start cron
crond -f -l 2
