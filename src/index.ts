#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { DreamshotClient, DreamshotApiError } from './client.js'
import {
  listTools,
  listToolsDefinition,
  generate,
  generateDefinition,
  status,
  statusDefinition,
  media,
  mediaDefinition,
  credits,
  creditsDefinition,
} from './tools/index.js'

const API_KEY = process.env.DREAMSHOT_API_KEY

if (!API_KEY) {
  console.error('Error: DREAMSHOT_API_KEY environment variable is required')
  console.error('Get your API key at https://dreamshot.ai/settings/api')
  process.exit(1)
}

const client = new DreamshotClient({
  apiKey: API_KEY,
  baseUrl: process.env.DREAMSHOT_BASE_URL,
})

const server = new Server(
  {
    name: 'dreamshot-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      listToolsDefinition,
      generateDefinition,
      statusDefinition,
      mediaDefinition,
      creditsDefinition,
    ],
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'dreamshot_list_tools':
        return await listTools(client)

      case 'dreamshot_generate':
        return await generate(client, args as Parameters<typeof generate>[1])

      case 'dreamshot_status':
        return await status(client, args as Parameters<typeof status>[1])

      case 'dreamshot_media':
        return await media(client, args as Parameters<typeof media>[1])

      case 'dreamshot_credits':
        return await credits(client)

      default:
        return {
          content: [
            {
              type: 'text' as const,
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        }
    }
  } catch (error) {
    if (error instanceof DreamshotApiError) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                error: error.code,
                message: error.message,
                status: error.status,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      }
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    }
  }
})

// Start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Dreamshot MCP server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
