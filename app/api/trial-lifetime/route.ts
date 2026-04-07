import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { PackageTier } from '@/lib/supabase/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const TRIAL_PACKAGES: Record<PackageTier, { days: number; price: number }> = {
  bronze: { days: 7, price: 0 },
  silver: { days: 3, price: 5000 },
  gold: { days: 3, price: 10000 },
  free: { days: 0, price: 0 },
}

const LIFETIME_PACKAGES: Record<PackageTier, number> = {
  bronze: 150000,
  silver: 350000,
  gold: 500000,
  free: 0,
}

async function getUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return null
    return user.id
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const userId = await getUserId(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (type === 'trial') {
      const { data: activeTrial } = await supabase
        .from('trial_conversions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      return NextResponse.json({
        success: true,
        has_active_trial: !!activeTrial,
        trial: activeTrial || null,
        available_trials: TRIAL_PACKAGES,
      })
    }

    if (type === 'lifetime') {
      const { data: lifetimeDeal } = await supabase
        .from('lifetime_deals')
        .select('*')
        .eq('user_id', userId)
        .single()

      const { data: settingsData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'lifetime_benefits')
        .single()

      return NextResponse.json({
        success: true,
        lifetime_deal: lifetimeDeal,
        lifetime_prices: LIFETIME_PACKAGES,
        lifetime_benefits: (settingsData?.value as Record<string, string[]>) || {},
      })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Trial/Lifetime GET error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, tier, payment_method, customer_phone } = body

    if (!type || !['trial', 'lifetime'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Use "trial" or "lifetime"' }, { status: 400 })
    }

    if (!tier || !['bronze', 'silver', 'gold'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (type === 'trial') {
      const { data: activeTrial } = await supabase
        .from('trial_conversions')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (activeTrial) {
        return NextResponse.json({ error: 'You already have an active trial' }, { status: 400 })
      }

      const trialConfig = TRIAL_PACKAGES[tier as PackageTier]
      const trialEnds = new Date()
      trialEnds.setDate(trialEnds.getDate() + trialConfig.days)

      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          package_tier: tier as PackageTier,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: trialEnds.toISOString(),
          subscription_type: 'trial',
          trial_ends_at: trialEnds.toISOString(),
        })
        .select()
        .single()

      if (subError) {
        console.error('Failed to create trial subscription:', subError)
        return NextResponse.json({ error: 'Failed to start trial' }, { status: 500 })
      }

      const { error: trialError } = await supabase
        .from('trial_conversions')
        .insert({
          user_id: userId,
          trial_tier: tier as PackageTier,
          started_at: new Date().toISOString(),
          status: 'active',
        })

      if (trialError) {
        console.error('Failed to create trial record:', trialError)
      }

      return NextResponse.json({
        success: true,
        message: `Your ${tier} trial has started! It expires on ${trialEnds.toLocaleDateString()}`,
        subscription,
        trial_ends_at: trialEnds.toISOString(),
      })
    }

    if (type === 'lifetime') {
      const { data: existingLifetime } = await supabase
        .from('lifetime_deals')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (existingLifetime) {
        return NextResponse.json({ error: 'You already have a lifetime deal' }, { status: 400 })
      }

      const amount = LIFETIME_PACKAGES[tier as PackageTier]
      if (amount === 0) {
        return NextResponse.json({ error: 'Invalid lifetime package' }, { status: 400 })
      }

      const { data: settingsData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'lifetime_benefits')
        .single()

      const benefits = (settingsData?.value as Record<string, string[]>) || {}

      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          package_tier: tier as PackageTier,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: null,
          subscription_type: 'lifetime',
          is_lifetime: true,
        })
        .select()
        .single()

      if (subError) {
        console.error('Failed to create lifetime subscription:', subError)
        return NextResponse.json({ error: 'Failed to create lifetime subscription' }, { status: 500 })
      }

      const { error: lifetimeError } = await supabase
        .from('lifetime_deals')
        .insert({
          user_id: userId,
          package_tier: tier as PackageTier,
          amount_paid: amount,
          currency: 'TZS',
          benefits: benefits[tier] || [],
        })

      if (lifetimeError) {
        console.error('Failed to create lifetime deal record:', lifetimeError)
      }

      return NextResponse.json({
        success: true,
        message: `Welcome to ${tier} lifetime! You now have lifetime access.`,
        subscription,
        lifetime_deal: {
          package_tier: tier,
          amount_paid: amount,
          benefits: benefits[tier] || [],
        },
      })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Trial/Lifetime POST error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}