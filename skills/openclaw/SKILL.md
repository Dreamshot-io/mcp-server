# Dreamshot AI Generation

Generate professional AI images and videos using Dreamshot's API.

## Environment

```bash
DREAMSHOT_API_KEY=dst_xxx  # Required
```

## Scripts

| Script | Description |
|--------|-------------|
| `list-tools.sh` | List available tools with variants and costs |
| `generate.sh` | Start an AI generation |
| `status.sh` | Check generation status |
| `media.sh` | Get download URLs |
| `credits.sh` | Check remaining credits |

## Workflows

### Image Editing

```bash
# 1. Generate
./scripts/generate.sh ai_edit ultra "product on marble surface" "https://image.url/photo.jpg"
# Returns: generationId

# 2. Poll until completed
./scripts/status.sh <generationId>

# 3. Get download URLs
./scripts/media.sh <generationId>
```

### Video Generation

```bash
# 1. Generate video
./scripts/generate.sh create_video "google/veo-3.1" "cinematic pan around product" "https://image.url/photo.jpg" 8

# 2. Poll and download
./scripts/status.sh <generationId>
./scripts/media.sh <generationId>
```

### Upscaling

```bash
./scripts/generate.sh enhancer magnific_precision "" "https://image.url/photo.jpg"
./scripts/status.sh <generationId>
./scripts/media.sh <generationId>
```

## Tool Reference

### ai_edit
- Variants: `ultra` (1cr), `nano` (0.5cr), `seedream` (0.5cr), `flux` (0.5cr), `flux2max` (1cr), `gpt_image_1` (1.5cr)
- Input: prompt + optional image URLs

### create_video
- Models: `google/veo-3.1`, `kwaivgi/kling-v2.6`, `fal-ai/kling-v3-pro`, `openai/sora-2`
- Input: prompt + optional starting image + duration

### enhancer
- Variants: `dreamshot` (2cr), `magnific_precision` (3cr), `magnific_creative` (4cr)
- Input: image URL

## Notes

- Poll status every 2-3 seconds until completed
- Download URLs expire after 1 hour
- Check credits before expensive operations
