import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getClickPesaClient } from '@/lib/clickpesa'
import type { PackageTier, PaymentMethod } from '@/lib/supabase/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const PACKAGE_PRICES: Record<PackageTier, number> = {
  bronze: 25000,
  silver: 100000,
  gold: 130000,
  free: 0,
}

function generateOrderReference(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `GFX-${timestamp}-${random}`
}

function mapPaymentMethod(method: string): PaymentMethod {
  const methodMap: Record<string, PaymentMethod> = {
    mpesa: 'mpesa',
    tigo: 'tigo_pesa',
    tigo_pesa: 'tigo_pesa',
    airtel: 'airtel_money',
    airtel_money: 'airtel_money',
    halo: 'halopesa',
    halopesa: 'halopesa',
  }
  return methodMap[method.toLowerCase()] || 'mpesa'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      package_tier,
      payment_method = 'mpesa',
      customer_email,
      customer_phone,
    } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!package_tier || !['bronze', 'silver', 'gold'].includes(package_tier)) {
      return NextResponse.json(
        { error: 'Valid package tier is required (bronze, silver, gold)' },
        { status: 400 }
      )
    }

    if (!customer_phone) {
      return NextResponse.json(
        { error: 'Customer phone number is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const clickpesa = getClickPesaClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone_number')
      .eq('user_id', user_id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const amount = PACKAGE_PRICES[package_tier as PackageTier]
    const orderReference = generateOrderReference()
    const mappedPaymentMethod = mapPaymentMethod(payment_method)

    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', user_id)
      .eq('package_tier', package_tier)
      .eq('payment_status', 'pending')
      .single()

    if (existingPayment) {
      return NextResponse.json(
        { error: 'You already have a pending payment for this package' },
        { status: 400 }
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
        package_tier: package_tier as PackageTier,
        customer_email: customer_email || profile.email,
        customer_phone: customer_phone || profile.phone_number,
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError)
      return NextResponse.json(
        { error: 'Failed to initiate payment' },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    try {
      const initiateResponse = await clickpesa.initiatePayment({
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
        return_url: `${baseUrl}/profile?payment=success&order=${orderReference}`,
      })

      await supabase
        .from('payments')
        .update({
          clickpesa_transaction_id: initiateResponse.data.transaction_id,
          provider_reference: initiateResponse.data.provider_reference,
        })
        .eq('id', payment.id)

      return NextResponse.json({
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
        },
        message: 'Payment initiated successfully. Please complete the payment on your phone.',
      })
    } catch (clickpesaError) {
      console.error('ClickPesa error:', clickpesaError)
      
      await supabase
        .from('payments')
        .update({ payment_status: 'failed' })
        .eq('id', payment.id)

      return NextResponse.json(
        {
          error: 'Failed to connect to payment provider. Please try again later.',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const orderReference = searchParams.get('order_reference')

    if (!userId && !orderReference) {
      return NextResponse.json(
        { error: 'User ID or order reference is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('payments')
      .select('*, subscriptions(*)')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (orderReference) {
      query = query.eq('order_reference', orderReference)
    }

    const { data: payments, error } = await query

    if (error) {
      console.error('Failed to fetch payments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch payments' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      payments: payments || [],
    })
  } catch (error) {
    console.error('Get payments error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
