
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const TIER_HIERARCHY: Record<string, number> = {
  free: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const status = searchParams.get('status') || 'active'
    const userTier = searchParams.get('tier') || 'free'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const userTierLevel = TIER_HIERARCHY[userTier] || 0
    const allowedTiers = Object.entries(TIER_HIERARCHY)
      .filter(([_, level]) => level <= userTierLevel)
      .map(([tier]) => tier)

    let query = supabase
      .from('signals')
      .select('*')
      .order('created_at', { ascending: false })

    if (status === 'active') {
      query = query.eq('status', 'active')
    }

    const { data: signals, error } = await query

    if (error) {
      console.error('Failed to fetch signals:', error)
      return NextResponse.json(
        { error: 'Failed to fetch signals' },
        { status: 500 }
      )
    }

    const filteredSignals = signals?.filter((signal) => {
      const signalTierLevel = TIER_HIERARCHY[signal.min_tier] || 0
      return signalTierLevel <= userTierLevel
    })

    const signalsWithCountdown = filteredSignals?.map((signal) => {
      const createdAt = new Date(signal.created_at)
      const expiresAt = new Date(createdAt.getTime() + signal.validity_hours * 60 * 60 * 1000)
      const now = new Date()
      const hoursLeft = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)))
      const minutesLeft = Math.max(0, Math.floor(((expiresAt.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60)))

      return {
        ...signal,
        hours_left: hoursLeft,
        minutes_left: minutesLeft,
        is_expired: now > expiresAt,
      }
    })

    return NextResponse.json({
      success: true,
      signals: signalsWithCountdown || [],
      user_tier: userTier,
      allowed_tiers: allowedTiers,
    })
  } catch (error) {
    console.error('Signals fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      pair,
      action,
      entry_price,
      stop_loss,
      take_profit,
      validity_hours = 24,
      min_tier = 'bronze',
    } = body

    if (!pair || !action || !entry_price || !stop_loss || !take_profit) {
      return NextResponse.json(
        { error: 'All signal fields are required' },
        { status: 400 }
      )
    }

    if (!['BUY', 'SELL'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be BUY or SELL' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: signal, error } = await supabase
      .from('signals')
      .insert({
        pair,
        action,
        entry_price,
        stop_loss,
        take_profit,
        status: 'active',
        validity_hours,
        min_tier,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create signal:', error)
      return NextResponse.json(
        { error: 'Failed to create signal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      signal,
    })
  } catch (error) {
    console.error('Signal creation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { signal_id, status, closing_price } = body

    if (!signal_id) {
      return NextResponse.json(
        { error: 'Signal ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (closing_price) {
      updateData.closing_price = closing_price
      updateData.closed_at = new Date().toISOString()
    }

    const { data: signal, error } = await supabase
      .from('signals')
      .update(updateData)
      .eq('id', signal_id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update signal:', error)
      return NextResponse.json(
        { error: 'Failed to update signal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      signal,
    })
  } catch (error) {
    console.error('Signal update error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
