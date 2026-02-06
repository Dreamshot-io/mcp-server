import { z } from 'zod'
import type { DreamshotClient } from '../client.js'

export const listToolsSchema = z.object({})

export type ListToolsInput = z.infer<typeof listToolsSchema>

export async function listTools(client: DreamshotClient) {
  const response = await client.listTools()

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(response.tools, null, 2),
      },
    ],
  }
}

export const listToolsDefinition = {
  name: 'dreamshot_list_tools',
  description:
    'List available Dreamshot AI tools with their variants and credit costs. Use this to discover what tools are available before generating.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [] as string[],
  },
}
