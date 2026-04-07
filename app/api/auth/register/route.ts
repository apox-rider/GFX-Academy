import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, full_name, phone_number } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    const password_hash = await hashPassword(password)

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash,
        full_name: full_name || '',
        phone_number: phone_number || '',
      })
      .select('id, email, full_name, phone_number')
      .single()

    if (error) {
      console.error('User creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    }

    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      user_id: user.id,
    })

    const token = await createToken(user.id, user.email)
    const cookie = setAuthCookie(token)

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      message: 'Account created successfully',
    })

    response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2])

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
