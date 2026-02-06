/**
 * Dreamshot API Client
 *
 * Base URL: https://dreamshot.ai/api/v1
 * Auth: Bearer token (dst_xxx format)
 */

export interface DreamshotConfig {
  apiKey: string
  baseUrl?: string
}

export interface ApiError {
  error: string
  message: string
}

export interface Tool {
  name: string
  kind: string
  variants: string[]
  cost: Record<string, number>
  description: string
}

export interface ListToolsResponse {
  tools: Tool[]
}

export interface GenerateParams {
  tool: string
  variant?: string
  params: Record<string, unknown>
  imageUrls?: string[]
  projectId?: string
}

export interface GenerateResponse {
  generationId: string
  status: 'processing'
  tool: string
  variant: string | null
}

export interface MediaItem {
  id: string
  displayUrl: string
  mediaKind: string
  resolution: string
}

export interface StatusResponse {
  generationId: string
  status: 'pending' | 'completed' | 'failed'
  tool: string
  variant: string | null
  error: { type: string; message: string } | null
  createdAt: string
  mediaItems: MediaItem[]
}

export interface MediaItemWithDownload {
  id: string
  displayUrl: string
  downloadUrl: string
  mediaKind: string
  resolution: string
}

export interface MediaResponse {
  generationId: string
  media: MediaItemWithDownload[]
}

export interface CreditsResponse {
  organizationId: string
  credits: number
}

export class DreamshotApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'DreamshotApiError'
  }
}

export class DreamshotClient {
  private apiKey: string
  private baseUrl: string

  constructor(config: DreamshotConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://app.dreamshot.io/api/v1'
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()

    if (!response.ok) {
      const error = data as ApiError
      throw new DreamshotApiError(
        response.status,
        error.error || 'unknown_error',
        error.message || 'An unknown error occurred'
      )
    }

    return data as T
  }

  /**
   * List available tools with their variants and costs
   */
  async listTools(): Promise<ListToolsResponse> {
    return this.request<ListToolsResponse>('GET', '/tools')
  }

  /**
   * Start a new generation (async operation)
   */
  async generate(params: GenerateParams): Promise<GenerateResponse> {
    return this.request<GenerateResponse>('POST', '/generations', params)
  }

  /**
   * Get the status of a generation
   */
  async getStatus(generationId: string): Promise<StatusResponse> {
    return this.request<StatusResponse>('GET', `/generations/${generationId}`)
  }

  /**
   * Get media download URLs for a completed generation
   */
  async getMedia(generationId: string): Promise<MediaResponse> {
    return this.request<MediaResponse>(
      'GET',
      `/generations/${generationId}/media`
    )
  }

  /**
   * Get remaining credits for the organization
   */
  async getCredits(): Promise<CreditsResponse> {
    return this.request<CreditsResponse>('GET', '/credits')
  }

  /**
   * Poll generation until completed or failed
   */
  async waitForCompletion(
    generationId: string,
    options?: {
      pollInterval?: number
      timeout?: number
      onPoll?: (status: StatusResponse) => void
    }
  ): Promise<StatusResponse> {
    const pollInterval = options?.pollInterval || 2000
    const timeout = options?.timeout || 300000 // 5 minutes default
    const startTime = Date.now()

    while (true) {
      const status = await this.getStatus(generationId)

      if (options?.onPoll) {
        options.onPoll(status)
      }

      if (status.status === 'completed' || status.status === 'failed') {
        return status
      }

      if (Date.now() - startTime > timeout) {
        throw new DreamshotApiError(
          408,
          'timeout',
          `Generation ${generationId} timed out after ${timeout}ms`
        )
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval))
    }
  }
}
