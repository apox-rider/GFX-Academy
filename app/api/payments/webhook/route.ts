import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function verifySignature(payload: string, signature: string, apiKey: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', apiKey)
    .update(payload)
    .digest('hex')
  return signature === expectedSignature
}

export async function POST(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type, x-clickpesa-signature',
      },
    })
  }

  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-clickpesa-signature') || ''
    const apiKey = process.env.CLICKPESA_API_KEY

    if (apiKey) {
      const isValidSignature = verifySignature(rawBody, signature, apiKey)
      if (!isValidSignature) {
        console.warn('Invalid webhook signature received')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    let payload: { data?: {
      order_reference: string
      payment_status: string
      transaction_id: string
      provider_reference: string | null
      amount: number
      currency: string
    } } | null = null
    
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    if (!payload || !payload.data) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    const { order_reference, payment_status, transaction_id, provider_reference, amount } = payload.data

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_reference', order_reference)
      .single()

    if (error || !payment) {
      console.error('Payment not found for webhook:', order_reference)
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    const statusMapping: Record<string, 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'> = {
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
      return NextResponse.json(
        { error: 'Failed to update payment' },
        { status: 500 }
      )
    }

    if (mappedStatus === 'completed') {
      const metadata = payment.metadata || {}
      const paymentType = metadata.type

      if (paymentType === 'course_purchase') {
        const courseId = metadata.course_id
        if (courseId) {
          const { error: purchaseError } = await supabase
            .from('course_purchases')
            .insert({
              user_id: payment.user_id,
              course_id: courseId,
              payment_id: payment.id,
              amount: payment.amount,
              currency: payment.currency,
            })

          if (purchaseError) {
            console.error('Failed to create course purchase:', purchaseError)
          }
        }
      } else if (payment.is_lifetime) {
        const { data: existingLifetime } = await supabase
          .from('lifetime_deals')
          .select('id')
          .eq('user_id', payment.user_id)
          .single()

        if (!existingLifetime) {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('package_tier')
            .eq('user_id', payment.user_id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          const tier = subscription?.package_tier || 'bronze'

          await supabase
            .from('lifetime_deals')
            .insert({
              user_id: payment.user_id,
              package_tier: tier,
              amount_paid: payment.amount,
              currency: payment.currency,
              payment_id: payment.id,
            })

          await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              subscription_type: 'lifetime',
              is_lifetime: true,
              end_date: null,
            })
            .eq('user_id', payment.user_id)
            .eq('status', 'active')
        }
      } else {
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 1)

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

        const { data: newSubscription, error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: payment.user_id,
            package_tier: payment.package_tier,
            status: 'active',
            start_date: new Date().toISOString(),
            end_date: endDate.toISOString(),
            subscription_type: 'monthly',
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
    }

    console.log(`Webhook processed: Order ${order_reference} - Status: ${mappedStatus}`)

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
