export type ClickPesaEnvironment = 'sandbox' | 'production'

export type PaymentMethod = 'mpesa' | 'tigo_pesa' | 'airtel_money' | 'halopesa' | 'card'

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface ClickPesaTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

export interface ClickPesaPreviewRequest {
  amount: number
  currency: string
  order_reference: string
  payment_methods: PaymentMethod[]
  customer: {
    email?: string
    phone_number: string
    name?: string
  }
  description?: string
  callback_url?: string
  return_url?: string
}

export interface ClickPesaPreviewResponse {
  status: boolean
  message: string
  data: {
    checkout_url: string
    order_reference: string
    expires_at: string
    available_payment_methods: PaymentMethod[]
  }
}

export interface ClickPesaInitiateRequest {
  amount: number
  currency: string
  order_reference: string
  payment_method: PaymentMethod
  customer: {
    email?: string
    phone_number: string
    name?: string
  }
  description?: string
  callback_url?: string
  return_url?: string
}

export interface ClickPesaInitiateResponse {
  status: boolean
  message: string
  data: {
    transaction_id: string
    order_reference: string
    checkout_url: string
    provider_reference: string
    status: PaymentStatus
    expires_at: string
  }
}

export interface ClickPesaStatusResponse {
  status: boolean
  message: string
  data: {
    transaction_id: string
    order_reference: string
    amount: number
    currency: string
    payment_status: PaymentStatus
    payment_method: PaymentMethod
    provider_reference: string | null
    customer: {
      email: string | null
      phone_number: string
      name: string | null
    }
    created_at: string
    updated_at: string
    metadata: Record<string, unknown>
  }
}

export interface ClickPesaWebhookPayload {
  event: string
  data: {
    transaction_id: string
    order_reference: string
    amount: number
    currency: string
    payment_status: PaymentStatus
    payment_method: PaymentMethod
    provider_reference: string | null
    customer: {
      email: string | null
      phone_number: string
      name: string | null
    }
    created_at: string
    updated_at: string
    metadata: Record<string, unknown>
  }
}

export interface ClickPesaError {
  status: boolean
  message: string
  code?: string
  details?: Record<string, string[]>
}
