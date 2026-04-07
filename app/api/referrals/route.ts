import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return 'GFX-' + result
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
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: referralCode, error: codeError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (codeError && codeError.code !== 'PGRST116') {
      console.error('Failed to fetch referral code:', codeError)
    }

    let code = referralCode?.code
    if (!code) {
      code = generateReferralCode()
      await supabase.from('referral_codes').insert({
        user_id: userId,
        code,
        reward_tier: 'bronze',
      })
    }

    const { data: referrals } = await supabase
      .from('referrals')
      .select('*, referred:profiles!referrals_referred_id_fkey(full_name, email)')
      .eq('referrer_id', userId)

    const { data: rewards } = await supabase
      .from('referral_rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'applied')

    const totalEarnings = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0

    return NextResponse.json({
      success: true,
      referral_code: code,
      stats: {
        total_referrals: referrals?.length || 0,
        completed_referrals: referrals?.filter(r => r.status === 'completed').length || 0,
        total_earnings: totalEarnings,
      },
      referrals: referrals || [],
    })
  } catch (error) {
    console.error('Referral GET error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referral_code, referrer_id } = body

    if (!referral_code) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: refCode, error: codeError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', referral_code)
      .single()

    if (codeError || !refCode) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
    }

    if (!refCode.is_active) {
      return NextResponse.json({ error: 'This referral code is no longer active' }, { status: 400 })
    }

    if (refCode.usage_count >= refCode.max_uses) {
      return NextResponse.json({ error: 'This referral code has reached its usage limit' }, { status: 400 })
    }

    let referredUserId = referrer_id
    if (!referredUserId) {
      const userId = await getUserId(request)
      if (!userId) {
        return NextResponse.json({ error: 'Please log in to use a referral code' }, { status: 401 })
      }
      referredUserId = userId
    }

    if (refCode.user_id === referredUserId) {
      return NextResponse.json({ error: 'You cannot use your own referral code' }, { status: 400 })
    }

    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', referredUserId)
      .in('status', ['pending', 'completed'])
      .single()

    if (existingReferral) {
      return NextResponse.json({ error: 'You have already used a referral code' }, { status: 400 })
    }

    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 3)

    const { data: referral, error: insertError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: refCode.user_id,
        referred_id: referredUserId,
        referral_code: referral_code,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to create referral:', insertError)
      return NextResponse.json({ error: 'Failed to apply referral code' }, { status: 500 })
    }

    const { data: settingsData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'referral_rewards')
      .single()

    const rewards = (settingsData?.value as Record<string, number>) || { bronze: 5000, silver: 15000, gold: 25000 }
    const rewardAmount = rewards[refCode.reward_tier] || 5000

    await supabase
      .from('referral_codes')
      .update({ usage_count: refCode.usage_count + 1 })
      .eq('id', refCode.id)

    return NextResponse.json({
      success: true,
      referral,
      reward: {
        amount: rewardAmount,
        tier: refCode.reward_tier,
        description: `You will receive a ${refCode.reward_tier} tier discount on your first subscription!`,
      },
    })
  } catch (error) {
    console.error('Referral POST error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}