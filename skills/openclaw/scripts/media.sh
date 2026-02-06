#!/bin/bash
# Get download URLs for a completed Dreamshot generation
# Usage: ./media.sh <generationId>

set -e

if [ -z "$DREAMSHOT_API_KEY" ]; then
  echo "Error: DREAMSHOT_API_KEY environment variable is required" >&2
  exit 1
fi

GENERATION_ID="${1:?Generation ID is required}"

curl -s -X GET "https://app.dreamshot.io/api/v1/generations/$GENERATION_ID/media" \
  -H "Authorization: Bearer $DREAMSHOT_API_KEY" \
  -H "Content-Type: application/json" | jq .
