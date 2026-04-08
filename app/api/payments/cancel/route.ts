import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment_id } = body

    if (!payment_id) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('payments')
      .update({ payment_status: 'cancelled' })
      .eq('id', payment_id)

    if (error) {
      console.error('Failed to cancel payment:', error)
      return NextResponse.json(
        { error: 'Failed to cancel payment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment cancelled successfully',
    })
  } catch (error) {
    console.error('Cancel payment error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}