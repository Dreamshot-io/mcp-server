import { z } from 'zod'
import type { DreamshotClient } from '../client.js'

export const statusSchema = z.object({
  generationId: z.string().describe('The generation ID to check status for'),
})

export type StatusInput = z.infer<typeof statusSchema>

export async function status(client: DreamshotClient, input: StatusInput) {
  const response = await client.getStatus(input.generationId)

  const result: Record<string, unknown> = {
    generationId: response.generationId,
    status: response.status,
    tool: response.tool,
    variant: response.variant,
    createdAt: response.createdAt,
  }

  if (response.status === 'completed') {
    result.mediaItems = response.mediaItems
    result.message = `Generation completed! ${response.mediaItems.length} media item(s) ready. Use dreamshot_media to get download URLs.`
  } else if (response.status === 'failed') {
    result.error = response.error
    result.message = `Generation failed: ${response.error?.message || 'Unknown error'}`
  } else {
    result.message = 'Generation still processing. Poll again in a few seconds.'
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
  }
}

export const statusDefinition = {
  name: 'dreamshot_status',
  description:
    'Check the status of a Dreamshot generation. Returns pending, completed, or failed with media items if completed.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      generationId: {
        type: 'string',
        description: 'The generation ID to check status for',
      },
    },
    required: ['generationId'],
  },
}
