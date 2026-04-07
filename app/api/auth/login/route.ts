import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, full_name, phone_number, is_active')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is disabled' },
        { status: 403 }
      )
    }

    const isValid = await verifyPassword(password, user.password_hash)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    const token = await createToken(user.id, user.email)
    const cookie = setAuthCookie(token)

    const { data: profile } = await supabase
      .from('profiles')
      .select('*, subscriptions(*)')
      .eq('id', user.id)
      .single()

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        ...profile,
      },
      message: 'Login successful',
    })

    response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2])

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
