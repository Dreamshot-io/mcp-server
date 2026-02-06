import { z } from 'zod'
import type { DreamshotClient } from '../client.js'

export const mediaSchema = z.object({
  generationId: z.string().describe('The generation ID to get media for'),
})

export type MediaInput = z.infer<typeof mediaSchema>

export async function media(client: DreamshotClient, input: MediaInput) {
  const response = await client.getMedia(input.generationId)

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            generationId: response.generationId,
            mediaCount: response.media.length,
            media: response.media.map((m) => ({
              id: m.id,
              displayUrl: m.displayUrl,
              downloadUrl: m.downloadUrl,
              mediaKind: m.mediaKind,
              resolution: m.resolution,
            })),
            message:
              response.media.length > 0
                ? `${response.media.length} media item(s) available. Download URLs expire in 1 hour.`
                : 'No media available for this generation.',
          },
          null,
          2
        ),
      },
    ],
  }
}

export const mediaDefinition = {
  name: 'dreamshot_media',
  description:
    'Get download URLs for a completed Dreamshot generation. URLs expire after 1 hour.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      generationId: {
        type: 'string',
        description: 'The generation ID to get media for',
      },
    },
    required: ['generationId'],
  },
}
