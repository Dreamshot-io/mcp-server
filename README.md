# Dreamshot MCP Server

[![npm version](https://badge.fury.io/js/@dreamshot%2Fmcp-server.svg)](https://www.npmjs.com/package/@dreamshot/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP server for [Dreamshot](https://dreamshot.ai) AI image and video generation. Use it with Claude Desktop, Claude Code, or any MCP-compatible client.

## Quick Start

### 1. Get your API key

Sign up at [dreamshot.io](https://dreamshot.io) and get your API key from [Settings > API](https://dreamshot.io/settings/api).

### 2. Add to your MCP config

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "dreamshot": {
      "command": "npx",
      "args": ["@dreamshot/mcp-server"],
      "env": {
        "DREAMSHOT_API_KEY": "dst_your_key_here"
      }
    }
  }
}
```

**Claude Code** (`.mcp.json`):

```json
{
  "mcpServers": {
    "dreamshot": {
      "command": "npx",
      "args": ["@dreamshot/mcp-server"],
      "env": {
        "DREAMSHOT_API_KEY": "dst_your_key_here"
      }
    }
  }
}
```

### 3. Start using it

Ask Claude to generate images or videos:

> "Generate a product photo on a marble surface"
> "Create a 5-second video panning around this product"
> "Upscale this image to 4K"

## Available Tools

| Tool | Description |
|------|-------------|
| `dreamshot_list_tools` | List available tools with variants and credit costs |
| `dreamshot_generate` | Start an AI generation (returns generationId) |
| `dreamshot_status` | Check generation status (pending/completed/failed) |
| `dreamshot_media` | Get download URLs for completed generations |
| `dreamshot_credits` | Check remaining credits |

## Supported AI Tools

### Image Editing (`ai_edit`)

Edit images using AI with text prompts.

| Variant | Credits | Description |
|---------|---------|-------------|
| `ultra` | 1 | Best quality, supports model references |
| `nano` | 0.5 | Fast iterations |
| `seedream` | 0.5 | Seedream model |
| `flux` | 0.5 | FLUX-based editing |
| `flux2max` | 1 | FLUX 2 Max quality |
| `gpt_image_1` | 1.5 | OpenAI GPT Image |

### Video Generation (`create_video`)

Generate videos from images and/or text prompts.

| Model | Credits | Description |
|-------|---------|-------------|
| `google/veo-3.1` | 16+ | Latest Veo with audio |
| `kwaivgi/kling-v2.6` | 4-14 | Kling 2.6 Pro |
| `fal-ai/kling-v3-pro` | 17 | Kling 3.0 Pro |
| `openai/sora-2` | 4-12 | OpenAI Sora 2 |
| `openai/sora-2-pro` | 8-24 | OpenAI Sora 2 Pro |

### Image Enhancement (`enhancer`)

Upscale and enhance image quality.

| Variant | Credits | Description |
|---------|---------|-------------|
| `dreamshot` | 2 | General upscaling |
| `magnific_precision` | 3 | Sharp, detailed |
| `magnific_creative` | 4 | Creative enhancement |

### More Tools

- `generate_image` - Generate from trained models
- `create_anything` - Text-to-image with FLUX

Run `dreamshot_list_tools` to see all available tools and current pricing.

## Example Workflow

```
1. Check credits
   → dreamshot_credits()

2. Start generation
   → dreamshot_generate(
       tool: "ai_edit",
       variant: "ultra",
       prompt: "luxury perfume on marble",
       imageUrls: ["https://..."]
     )
   → Returns: { generationId: "abc123" }

3. Poll status
   → dreamshot_status(generationId: "abc123")
   → Returns: { status: "pending" }

4. Poll again
   → dreamshot_status(generationId: "abc123")
   → Returns: { status: "completed", mediaItems: [...] }

5. Get download URLs
   → dreamshot_media(generationId: "abc123")
   → Returns: { media: [{ downloadUrl: "..." }] }
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DREAMSHOT_API_KEY` | Yes | Your Dreamshot API key (`dst_xxx`) |
| `DREAMSHOT_BASE_URL` | No | Custom API URL (defaults to `https://app.dreamshot.io/api/v1`) |

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Run built version
npm start
```

## Links

- [Dreamshot](https://dreamshot.io) - AI photo generation platform
- [API Documentation](https://dreamshot.io/docs/api)
- [Get API Key](https://dreamshot.io/settings/api)
- [MCP Specification](https://modelcontextprotocol.io)

## License

MIT
