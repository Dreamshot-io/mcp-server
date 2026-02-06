import { z } from 'zod'
import type { DreamshotClient } from '../client.js'

export const generateSchema = z.object({
  tool: z.string().describe('The tool to use (e.g., ai_edit, create_video, enhancer)'),
  variant: z.string().optional().describe('Specific variant of the tool (e.g., ultra, nano, seedream)'),
  prompt: z.string().optional().describe('Text prompt describing what to generate or edit'),
  aspectRatio: z.string().optional().describe('Output aspect ratio (e.g., 1:1, 16:9, 9:16)'),
  duration: z.number().optional().describe('Video duration in seconds (for create_video)'),
  outputCount: z.number().optional().describe('Number of outputs to generate (1-4)'),
  imageUrls: z.array(z.string()).optional().describe('Input image URLs for editing tools'),
  model: z.string().optional().describe('Video model to use (for create_video)'),
  generateAudio: z.boolean().optional().describe('Generate audio for video (for create_video)'),
  projectId: z.string().optional().describe('Optional project ID to organize generations'),
})

export type GenerateInput = z.infer<typeof generateSchema>

export async function generate(client: DreamshotClient, input: GenerateInput) {
  // Build params from input
  const params: Record<string, unknown> = {}

  if (input.prompt) params.prompt = input.prompt
  if (input.aspectRatio) params.aspectRatio = input.aspectRatio
  if (input.duration) params.duration = input.duration
  if (input.outputCount) params.outputCount = input.outputCount
  if (input.model) params.model = input.model
  if (input.generateAudio !== undefined) params.generateAudio = input.generateAudio

  const response = await client.generate({
    tool: input.tool,
    variant: input.variant,
    params,
    imageUrls: input.imageUrls,
    projectId: input.projectId,
  })

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            generationId: response.generationId,
            status: response.status,
            tool: response.tool,
            variant: response.variant,
            message: `Generation started. Use dreamshot_status with generationId "${response.generationId}" to check progress.`,
          },
          null,
          2
        ),
      },
    ],
  }
}

export const generateDefinition = {
  name: 'dreamshot_generate',
  description: `Start a Dreamshot AI generation. Returns a generationId to poll for status.

Available tools:
- ai_edit: Edit images with AI (variants: ultra, nano, seedream, flux, flux2max, gpt_image_1)
- create_video: Generate videos from images/prompts (variants: kling-v2.6, veo-3.1, sora-2, etc.)
- enhancer: Upscale images (variants: dreamshot, magnific_precision, magnific_creative)
- generate_image: Generate from trained models
- create_anything: Generate from text with FLUX

Use dreamshot_list_tools to see all available tools, variants, and costs.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      tool: {
        type: 'string',
        description: 'The tool to use (e.g., ai_edit, create_video, enhancer)',
      },
      variant: {
        type: 'string',
        description: 'Specific variant of the tool (e.g., ultra, nano, seedream)',
      },
      prompt: {
        type: 'string',
        description: 'Text prompt describing what to generate or edit',
      },
      aspectRatio: {
        type: 'string',
        description: 'Output aspect ratio (e.g., 1:1, 16:9, 9:16)',
      },
      duration: {
        type: 'number',
        description: 'Video duration in seconds (for create_video)',
      },
      outputCount: {
        type: 'number',
        description: 'Number of outputs to generate (1-4)',
      },
      imageUrls: {
        type: 'array',
        items: { type: 'string' },
        description: 'Input image URLs for editing tools',
      },
      model: {
        type: 'string',
        description: 'Video model to use (for create_video)',
      },
      generateAudio: {
        type: 'boolean',
        description: 'Generate audio for video (for create_video)',
      },
      projectId: {
        type: 'string',
        description: 'Optional project ID to organize generations',
      },
    },
    required: ['tool'],
  },
}
