import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch subscription:', error)
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: subscription || null,
    })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, package_tier } = body

    if (!user_id || !package_tier) {
      return NextResponse.json(
        { error: 'User ID and package tier are required' },
        { status: 400 }
      )
    }

    if (!['bronze', 'silver', 'gold', 'free'].includes(package_tier)) {
      return NextResponse.json(
        { error: 'Invalid package tier' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: existingSubscription, error: checkError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'active')
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Failed to check existing subscription:', checkError)
      return NextResponse.json(
        { error: 'Failed to check subscription' },
        { status: 500 }
      )
    }

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'User already has an active subscription. Please cancel it first.' },
        { status: 400 }
      )
    }

    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id,
        package_tier,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create subscription:', error)
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription,
      message: `Subscription to ${package_tier} package created successfully`,
    })
  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, status } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .update({ status: status || 'cancelled' })
      .eq('user_id', user_id)
      .eq('status', 'active')
      .select()
      .single()

    if (error) {
      console.error('Failed to cancel subscription:', error)
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Subscription cancelled successfully',
    })
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
