# Dreamshot AI Generation Skill

Generate professional AI images and videos using Dreamshot's API.

## Prerequisites

- Dreamshot API key (`DREAMSHOT_API_KEY` environment variable)
- MCP server installed: `npx @dreamshot/mcp-server`

## Available Tools

| Tool | Description |
|------|-------------|
| `dreamshot_list_tools` | List available tools, variants, and credit costs |
| `dreamshot_generate` | Start an AI generation (async) |
| `dreamshot_status` | Check generation status |
| `dreamshot_media` | Get download URLs for completed generations |
| `dreamshot_credits` | Check remaining credits |

## Common Workflows

### Generate an AI-edited image

```
1. dreamshot_generate(tool: "ai_edit", variant: "ultra", prompt: "product on marble surface", imageUrls: ["https://..."])
2. dreamshot_status(generationId: "...")  // Poll until completed
3. dreamshot_media(generationId: "...")   // Get download URLs
```

### Generate a video from an image

```
1. dreamshot_generate(tool: "create_video", model: "google/veo-3.1", prompt: "cinematic pan around product", imageUrls: ["https://..."], duration: 8)
2. dreamshot_status(generationId: "...")
3. dreamshot_media(generationId: "...")
```

### Upscale an image

```
1. dreamshot_generate(tool: "enhancer", variant: "magnific_precision", imageUrls: ["https://..."])
2. dreamshot_status(generationId: "...")
3. dreamshot_media(generationId: "...")
```

## Tool Reference

### ai_edit

Edit images with AI using text prompts.

**Variants:**
- `ultra` (1 credit) - Best quality, supports model references
- `nano` (0.5 credits) - Fast, good for iterations
- `seedream` (0.5 credits) - Seedream model
- `flux` (0.5 credits) - FLUX-based editing
- `flux2max` (1 credit) - FLUX 2 Max quality
- `gpt_image_1` (1.5 credits) - OpenAI GPT Image

**Parameters:**
- `prompt` (required): What to generate/edit
- `imageUrls`: Input images to edit
- `aspectRatio`: Output aspect ratio (1:1, 16:9, 9:16, etc.)
- `outputCount`: 1-4 images

### create_video

Generate videos from images and/or prompts.

**Models:**
- `google/veo-3.1` - Latest Veo with audio (16+ credits)
- `kwaivgi/kling-v2.6` - Kling 2.6 Pro (4-14 credits)
- `fal-ai/kling-v3-pro` - Kling 3.0 Pro (17 credits)
- `openai/sora-2` - Sora 2 (4-12 credits)
- `openai/sora-2-pro` - Sora 2 Pro (8-24 credits)

**Parameters:**
- `prompt` (required): Video description
- `imageUrls`: Starting frame image
- `duration`: Video length in seconds
- `generateAudio`: Enable audio generation
- `aspectRatio`: Output aspect ratio

### enhancer

Upscale and enhance image quality.

**Variants:**
- `dreamshot` (2 credits) - General upscaling
- `magnific_precision` (3 credits) - Sharp, detailed
- `magnific_creative` (4 credits) - Creative enhancement

**Parameters:**
- `imageUrls` (required): Image to enhance

### generate_image

Generate images from trained product/brand models.

**Parameters:**
- `prompt` (required): Generation prompt
- `trainingId`: Reference to trained model
- `aspectRatio`: Output aspect ratio
- `outputCount`: 1-4 images

### create_anything

Generate images from text using FLUX models.

**Parameters:**
- `prompt` (required): What to generate
- `aspectRatio`: Output aspect ratio
- `outputCount`: 1-4 images

## Best Practices

1. **Always check credits first** before expensive operations
2. **Poll status** with 2-3 second intervals until completed
3. **Download URLs expire** after 1 hour - get fresh ones if needed
4. **Use variants** to balance quality vs speed/cost
5. **Provide clear prompts** - the AI follows them closely

## Error Handling

Common errors:
- `insufficient_credits`: Need more credits
- `validation_error`: Invalid parameters
- `not_found`: Generation ID doesn't exist
- `timeout`: Generation took too long

## Example Session

```
User: Generate a product photo on marble

1. Check credits: dreamshot_credits()
   → 50 credits available

2. Generate: dreamshot_generate(
     tool: "ai_edit",
     variant: "ultra",
     prompt: "luxury perfume bottle on white marble surface, soft lighting",
     imageUrls: ["https://example.com/product.jpg"]
   )
   → generationId: "abc123"

3. Poll status: dreamshot_status(generationId: "abc123")
   → status: "pending"

4. Poll again: dreamshot_status(generationId: "abc123")
   → status: "completed", 2 media items

5. Get URLs: dreamshot_media(generationId: "abc123")
   → displayUrl, downloadUrl for each image
```
