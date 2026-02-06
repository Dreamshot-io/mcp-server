import { z } from 'zod'
import type { DreamshotClient } from '../client.js'

export const creditsSchema = z.object({})

export type CreditsInput = z.infer<typeof creditsSchema>

export async function credits(client: DreamshotClient) {
  const response = await client.getCredits()

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            organizationId: response.organizationId,
            credits: response.credits,
            message: `You have ${response.credits} credits remaining. Use dreamshot_list_tools to see credit costs per tool.`,
          },
          null,
          2
        ),
      },
    ],
  }
}

export const creditsDefinition = {
  name: 'dreamshot_credits',
  description:
    'Check remaining Dreamshot credits for your organization. Each tool has different credit costs.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [] as string[],
  },
}
