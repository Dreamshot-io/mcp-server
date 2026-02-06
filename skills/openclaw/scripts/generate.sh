#!/bin/bash
# Start a Dreamshot AI generation
# Usage: ./generate.sh <tool> <variant> <prompt> [imageUrl] [duration]
# Example: ./generate.sh ai_edit ultra "product on marble" "https://..."
# Example: ./generate.sh create_video "google/veo-3.1" "cinematic pan" "https://..." 8

set -e

if [ -z "$DREAMSHOT_API_KEY" ]; then
  echo "Error: DREAMSHOT_API_KEY environment variable is required" >&2
  exit 1
fi

TOOL="${1:?Tool is required (ai_edit, create_video, enhancer, etc.)}"
VARIANT="${2:-}"
PROMPT="${3:-}"
IMAGE_URL="${4:-}"
DURATION="${5:-}"

# Build JSON payload
JSON=$(jq -n \
  --arg tool "$TOOL" \
  --arg variant "$VARIANT" \
  --arg prompt "$PROMPT" \
  --arg imageUrl "$IMAGE_URL" \
  --arg duration "$DURATION" \
  '{
    tool: $tool,
    params: (
      {}
      | if $prompt != "" then . + {prompt: $prompt} else . end
      | if $duration != "" then . + {duration: ($duration | tonumber)} else . end
    )
  }
  | if $variant != "" then . + {variant: $variant} else . end
  | if $imageUrl != "" then . + {imageUrls: [$imageUrl]} else . end
  ')

curl -s -X POST "https://app.dreamshot.io/api/v1/generations" \
  -H "Authorization: Bearer $DREAMSHOT_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$JSON" | jq .
