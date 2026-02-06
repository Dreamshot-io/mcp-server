# CLAUDE.md - Dreamshot MCP Server

MCP server for Dreamshot AI image and video generation.

## Quick Reference

```bash
npm install     # Install deps
npm run build   # Build TypeScript
npm run dev     # Watch mode
npm start       # Run built server
```

## Structure

```
src/
├── index.ts     # MCP server entry point
├── client.ts    # Dreamshot API client
└── tools/       # MCP tool implementations
    ├── list-tools.ts
    ├── generate.ts
    ├── status.ts
    ├── media.ts
    └── credits.ts

skills/
├── claude/      # Claude Code skill
└── openclaw/    # OpenClaw skill with bash scripts
```

## API Mapping

| MCP Tool | API Endpoint |
|----------|-------------|
| `dreamshot_list_tools` | `GET /api/v1/tools` |
| `dreamshot_generate` | `POST /api/v1/generations` |
| `dreamshot_status` | `GET /api/v1/generations/:id` |
| `dreamshot_media` | `GET /api/v1/generations/:id/media` |
| `dreamshot_credits` | `GET /api/v1/credits` |

## Testing

Set `DREAMSHOT_API_KEY` and run:

```bash
npm run build
DREAMSHOT_API_KEY=dst_xxx node dist/index.js
```

## Releasing

1. Update version in package.json
2. `git tag v1.x.x`
3. `git push --tags`
4. GitHub Action publishes to npm
