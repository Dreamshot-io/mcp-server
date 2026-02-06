#!/bin/bash
# Check remaining Dreamshot credits
# Usage: ./credits.sh

set -e

if [ -z "$DREAMSHOT_API_KEY" ]; then
  echo "Error: DREAMSHOT_API_KEY environment variable is required" >&2
  exit 1
fi

curl -s -X GET "https://app.dreamshot.io/api/v1/credits" \
  -H "Authorization: Bearer $DREAMSHOT_API_KEY" \
  -H "Content-Type: application/json" | jq .
