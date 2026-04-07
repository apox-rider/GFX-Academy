import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST() {
  try {
    const cookie = clearAuthCookie()

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2])

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
