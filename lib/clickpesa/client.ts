import type {
  ClickPesaEnvironment,
  ClickPesaTokenResponse,
  ClickPesaPreviewRequest,
  ClickPesaPreviewResponse,
  ClickPesaInitiateRequest,
  ClickPesaInitiateResponse,
  ClickPesaStatusResponse,
  ClickPesaWebhookPayload,
  ClickPesaError,
} from './types'

const SANDBOX_BASE_URL = 'https://client-api.sandbox.clickpesa.com'
const PRODUCTION_BASE_URL = 'https://client-api.clickpesa.com'

class ClickPesaClient {
  private clientId: string
  private apiKey: string
  private environment: ClickPesaEnvironment
  private baseUrl: string
  private accessToken: string | null = null
  private tokenExpiresAt: number = 0

  constructor(clientId: string, apiKey: string, environment: ClickPesaEnvironment = 'sandbox') {
    this.clientId = clientId
    this.apiKey = apiKey
    this.environment = environment
    this.baseUrl = environment === 'sandbox' ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.clientId}:${this.apiKey}`).toString('base64')
    return `Basic ${credentials}`
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken
    }

    const response = await fetch(`${this.baseUrl}/identity/v1/token`, {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        scope: 'payments.all',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get access token: ${error.message || response.statusText}`)
    }

    const data: ClickPesaTokenResponse = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000

    return this.accessToken
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData: ClickPesaError = await response.json().catch(() => ({
        status: false,
        message: response.statusText,
      }))
      throw new Error(errorData.message || `Request failed with status ${response.status}`)
    }

    return response.json()
  }

  async previewPayment(request: ClickPesaPreviewRequest): Promise<ClickPesaPreviewResponse> {
    return this.makeRequest<ClickPesaPreviewResponse>('/payments/v1/preview', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async initiatePayment(request: ClickPesaInitiateRequest): Promise<ClickPesaInitiateResponse> {
    return this.makeRequest<ClickPesaInitiateResponse>('/payments/v1/ussd-push', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async checkPaymentStatus(orderReference: string): Promise<ClickPesaStatusResponse> {
    return this.makeRequest<ClickPesaStatusResponse>(
      `/payments/v1/query?order_reference=${encodeURIComponent(orderReference)}`
    )
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto')
    const secret = this.apiKey
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    return signature === expectedSignature
  }

  parseWebhookPayload(body: string): ClickPesaWebhookPayload | null {
    try {
      return JSON.parse(body)
    } catch {
      return null
    }
  }
}

let clickpesaClient: ClickPesaClient | null = null

export function getClickPesaClient(): ClickPesaClient {
  if (clickpesaClient) {
    return clickpesaClient
  }

  const clientId = process.env.CLICKPESA_CLIENT_ID
  const apiKey = process.env.CLICKPESA_API_KEY
  const environment = (process.env.CLICKPESA_ENVIRONMENT || 'sandbox') as ClickPesaEnvironment

  if (!clientId || !apiKey) {
    throw new Error('ClickPesa credentials not configured. Please set CLICKPESA_CLIENT_ID and CLICKPESA_API_KEY')
  }

  clickpesaClient = new ClickPesaClient(clientId, apiKey, environment)
  return clickpesaClient
}

export { ClickPesaClient }
