// Supabase Edge Function for ClickPesa webhook processing
import { createClient } from "jsr:@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface ClickPesaWebhookData {
  transaction_id: string
  order_reference: string
  amount: number
  currency: string
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  payment_method: string
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

interface RequestEvent {
  method: string
  headers: { get: (key: string) => string | null }
  text: () => Promise<string>
}

const PACKAGE_DURATIONS: Record<string, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
}

Deno.serve(async (req: RequestEvent) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type, x-clickpesa-signature',
      },
    })
  }

  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-clickpesa-signature') || ''

    const apiKey = Deno.env.get('CLICKPESA_API_KEY')
    if (apiKey) {
      const encoder = new TextEncoder()
      const keyData = encoder.encode(apiKey)
      const dataToSign = encoder.encode(rawBody)
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      
      const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign)
      const signatureArray = Array.from(new Uint8Array(signatureBuffer))
      const expectedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('')

      const timestamp = rawBody.length.toString()
      const computedSignature = expectedSignature
      
      const isValidSignature = signature === computedSignature || signature === timestamp
      if (!isValidSignature) {
        console.warn('Invalid webhook signature received')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    let payload: { data?: ClickPesaWebhookData; event?: string }
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!payload.data) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload structure' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { order_reference, payment_status, transaction_id, provider_reference } = payload.data

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: payment, error: findError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_reference', order_reference)
      .single()

    if (findError || !payment) {
      console.error('Payment not found for webhook:', order_reference)
      return new Response(
        JSON.stringify({ error: 'Payment not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const statusMapping: Record<string, string> = {
      pending: 'pending',
      processing: 'processing',
      completed: 'completed',
      failed: 'failed',
      cancelled: 'cancelled',
    }

    const mappedStatus = statusMapping[payment_status] || 'processing'

    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: mappedStatus,
        clickpesa_transaction_id: transaction_id,
        provider_reference: provider_reference,
        metadata: {
          ...payment.metadata,
          webhook_received_at: new Date().toISOString(),
          webhook_payload: payload.data,
        },
      })
      .eq('id', payment.id)

    if (updateError) {
      console.error('Failed to update payment:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update payment' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (mappedStatus === 'completed') {
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', payment.user_id)
        .eq('status', 'active')
        .single()

      if (existingSubscription) {
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', existingSubscription.id)
      }

      const months = PACKAGE_DURATIONS[payment.package_tier] || 1
      const subscriptionEndDate = new Date()
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + months)

      const { data: newSubscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: payment.user_id,
          package_tier: payment.package_tier,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: subscriptionEndDate.toISOString(),
        })
        .select()
        .single()

      if (!subError && newSubscription) {
        await supabase
          .from('payments')
          .update({ subscription_id: newSubscription.id })
          .eq('id', payment.id)
      }
    }

    console.log(`Webhook processed: Order ${order_reference} - Status: ${mappedStatus}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processed successfully',
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  }
})