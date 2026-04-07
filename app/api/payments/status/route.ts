import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getClickPesaClient } from '@/lib/clickpesa'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderReference = searchParams.get('order_reference')

    if (!orderReference) {
      return NextResponse.json(
        { error: 'Order reference is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_reference', orderReference)
      .single()

    if (error || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    if (payment.payment_status === 'completed' || payment.payment_status === 'failed') {
      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          order_reference: payment.order_reference,
          amount: payment.amount,
          currency: payment.currency,
          payment_status: payment.payment_status,
          package_tier: payment.package_tier,
          created_at: payment.created_at,
        },
      })
    }

    try {
      const clickpesa = getClickPesaClient()
      const statusResponse = await clickpesa.checkPaymentStatus(orderReference)

      const newStatus = statusResponse.data.payment_status

      if (newStatus !== payment.payment_status) {
        await supabase
          .from('payments')
          .update({
            payment_status: newStatus,
            metadata: {
              ...payment.metadata,
              last_checked: new Date().toISOString(),
              provider_status: statusResponse.data.payment_status,
            },
          })
          .eq('id', payment.id)

        if (newStatus === 'completed') {
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

      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          order_reference: payment.order_reference,
          amount: payment.amount,
          currency: payment.currency,
          payment_status: newStatus,
          package_tier: payment.package_tier,
          created_at: payment.created_at,
        },
        provider: {
          transaction_id: statusResponse.data.transaction_id,
          payment_method: statusResponse.data.payment_method,
          provider_reference: statusResponse.data.provider_reference,
        },
      })
    } catch (clickpesaError) {
      console.error('Failed to check ClickPesa status:', clickpesaError)

      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          order_reference: payment.order_reference,
          amount: payment.amount,
          currency: payment.currency,
          payment_status: payment.payment_status,
          package_tier: payment.package_tier,
          created_at: payment.created_at,
        },
        message: 'Unable to verify latest status with provider. Current status shown.',
      })
    }
  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
