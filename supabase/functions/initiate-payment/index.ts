// Supabase Edge Function for USSD payment push initiation
import { createClient } from "jsr:@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface RequestEvent {
  method: string
  headers: { get: (key: string) => string | null }
  json: () => Promise<unknown>
}

const PACKAGE_PRICES: Record<string, number> = {
  bronze: 25000,
  silver: 100000,
  gold: 130000,
}

const PACKAGE_DURATIONS: Record<string, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
}

function generateOrderReference(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `GFX-${timestamp}-${random}`
}

function mapPaymentMethod(method: string): string {
  const methodMap: Record<string, string> = {
    mpesa: 'mpesa',
    tigo: 'tigo_pesa',
    tigo: 'tigo_pesa',
    airtel: 'airtel_money',
    airtel: 'airtel_money',
    halo: 'halopesa',
    halopesa: 'halopesa',
  }
  return methodMap[method.toLowerCase()] || 'mpesa'
}

async function getClickPesaToken(): Promise<string> {
  const clientId = Deno.env.get('CLICKPESA_CLIENT_ID')!
  const apiKey = Deno.env.get('CLICKPESA_API_KEY')!
  const environment = Deno.env.get('CLICKPESA_ENVIRONMENT') || 'sandbox'
  
  const baseUrl = environment === 'sandbox' 
    ? 'https://client-api.sandbox.clickpesa.com'
    : 'https://client-api.clickpesa.com'

  const credentials = btoa(`${clientId}:${apiKey}`)
  
  const response = await fetch(`${baseUrl}/identity/v1/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      scope: 'payments.all',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get ClickPesa access token')
  }

  const data = await response.json()
  return data.access_token
}

async function initiatePayment(request: {
  amount: number
  currency: string
  order_reference: string
  payment_method: string
  customer: {
    email?: string
    phone_number: string
    name?: string
  }
  description?: string
  callback_url?: string
  return_url?: string
}): Promise<{
  status: boolean
  message: string
  data: {
    transaction_id: string
    order_reference: string
    checkout_url: string
    provider_reference: string
    status: string
    expires_at: string
  }
}> {
  const environment = Deno.env.get('CLICKPESA_ENVIRONMENT') || 'sandbox'
  
  const baseUrl = environment === 'sandbox' 
    ? 'https://client-api.sandbox.clickpesa.com'
    : 'https://client-api.clickpesa.com'

  const token = await getClickPesaToken()

  const response = await fetch(`${baseUrl}/payments/v1/ussd-push`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Payment request failed' }))
    throw new Error(error.message || 'Payment request failed')
  }

  return response.json()
}

Deno.serve(async (req: RequestEvent) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await req.json() as {
      user_id?: string
      package_tier?: string
      payment_method?: string
      customer_email?: string
      customer_phone?: string
    }

    const { user_id, package_tier, payment_method, customer_email, customer_phone } = body

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!package_tier || !['bronze', 'silver', 'gold'].includes(package_tier)) {
      return new Response(
        JSON.stringify({ error: 'Valid package tier is required (bronze, silver, gold)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!customer_phone) {
      return new Response(
        JSON.stringify({ error: 'Customer phone number is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone_number')
      .eq('user_id', user_id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const amount = PACKAGE_PRICES[package_tier]
    const orderReference = generateOrderReference()
    const mappedPaymentMethod = mapPaymentMethod(payment_method || 'mpesa')

    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', user_id)
      .eq('package_tier', package_tier)
      .eq('payment_status', 'pending')
      .single()

    if (existingPayment) {
      return new Response(
        JSON.stringify({ error: 'You already have a pending payment for this package' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user_id,
        order_reference: orderReference,
        amount: amount,
        currency: 'TZS',
        payment_method: mappedPaymentMethod,
        payment_status: 'pending',
        package_tier: package_tier,
        customer_email: customer_email || profile.email,
        customer_phone: customer_phone || profile.phone_number,
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError)
      return new Response(
        JSON.stringify({ error: 'Failed to initiate payment' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const baseUrl = Deno.env.get('NEXT_PUBLIC_BASE_URL') || 'http://localhost:3000'

    try {
      const initiateResponse = await initiatePayment({
        amount: amount,
        currency: 'TZS',
        order_reference: orderReference,
        payment_method: mappedPaymentMethod,
        customer: {
          email: customer_email || profile.email,
          phone_number: customer_phone.replace(/^0/, '255'),
          name: profile.full_name || undefined,
        },
        description: `GalileeFX Academy ${package_tier} package subscription`,
        callback_url: `${baseUrl}/api/payments/webhook`,
        return_url: `${baseUrl}/payment?payment=success&order=${orderReference}`,
      })

      await supabase
        .from('payments')
        .update({
          clickpesa_transaction_id: initiateResponse.data.transaction_id,
          provider_reference: initiateResponse.data.provider_reference,
        })
        .eq('id', payment.id)

      return new Response(
        JSON.stringify({
          success: true,
          payment: {
            id: payment.id,
            order_reference: orderReference,
            amount: amount,
            currency: 'TZS',
            package_tier: package_tier,
            status: 'pending',
          },
          clickpesa: {
            transaction_id: initiateResponse.data.transaction_id,
            checkout_url: initiateResponse.data.checkout_url,
            provider_reference: initiateResponse.data.provider_reference,
            expires_at: initiateResponse.data.expires_at,
          },
          message: 'Payment initiated successfully. Please complete the payment on your phone.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } catch (clickpesaError) {
      console.error('ClickPesa error:', clickpesaError)
      
      await supabase
        .from('payments')
        .update({ payment_status: 'failed' })
        .eq('id', payment.id)

      return new Response(
        JSON.stringify({
          error: 'Failed to connect to payment provider. Please try again later.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Payment initiation error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})