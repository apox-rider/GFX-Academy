import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: user } = await supabase
      .from('users')
      .select('id, email, full_name, phone_number')
      .eq('id', session.userId)
      .single()

    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*, subscriptions(*)')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      authenticated: true,
      user: {
        ...user,
        ...profile,
      },
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { authenticated: false, user: null, error: 'Session check failed' },
      { status: 500 }
    )
  }
}
