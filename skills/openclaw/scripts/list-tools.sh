#!/bin/bash
# List available Dreamshot tools with variants and costs
# Usage: ./list-tools.sh

set -e

if [ -z "$DREAMSHOT_API_KEY" ]; then
  echo "Error: DREAMSHOT_API_KEY environment variable is required" >&2
  exit 1
fi

curl -s -X GET "https://dreamshot.ai/api/v1/tools" \
  -H "Authorization: Bearer $DREAMSHOT_API_KEY" \
  -H "Content-Type: application/json" | jq .
