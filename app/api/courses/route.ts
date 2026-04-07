import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getClickPesaClient } from '@/lib/clickpesa'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function generateOrderReference(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `GFXC-${timestamp}-${random}`
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
    const courseId = searchParams.get('id')
    const userId = await getUserId(request)

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (courseId) {
      const { data: course, error } = await supabase
        .from('courses')
        .select('*, modules:course_modules(*, lessons:course_lessons(*))')
        .eq('id', courseId)
        .eq('is_published', true)
        .single()

      if (error || !course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }

      let isPurchased = false
      if (userId) {
        const { data: purchase } = await supabase
          .from('course_purchases')
          .select('id')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .single()
        isPurchased = !!purchase
      }

      const previewLessons = course.modules?.flatMap((m: any) => 
        (m.lessons || []).filter((l: any) => l.is_preview)
      ) || []

      return NextResponse.json({
        success: true,
        course: {
          ...course,
          is_purchased: isPurchased,
          preview_lessons: previewLessons,
        },
      })
    }

    const level = searchParams.get('level')
    const featured = searchParams.get('featured')

    let query = supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (level) {
      query = query.eq('level', level)
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    const { data: courses, error } = await query

    if (error) {
      console.error('Failed to fetch courses:', error)
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      courses: courses || [],
    })
  } catch (error) {
    console.error('Courses GET error:', error)
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
    const { course_id, payment_method, customer_phone } = body

    if (!course_id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', course_id)
      .eq('is_published', true)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const { data: existingPurchase } = await supabase
      .from('course_purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', course_id)
      .single()

    if (existingPurchase) {
      return NextResponse.json({ error: 'You have already purchased this course' }, { status: 400 })
    }

    if (!customer_phone) {
      return NextResponse.json({ error: 'Phone number is required for payment' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    const orderReference = generateOrderReference()

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        order_reference: orderReference,
        amount: course.price,
        currency: course.currency || 'TZS',
        payment_method: payment_method || 'mpesa',
        payment_status: 'pending',
        package_tier: 'free',
        customer_email: profile?.email,
        customer_phone,
        metadata: {
          type: 'course_purchase',
          course_id,
          course_title: course.title,
        },
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Failed to create payment:', paymentError)
      return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
    }

    const clickpesa = getClickPesaClient()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    try {
      const initiateResponse = await clickpesa.initiatePayment({
        amount: course.price,
        currency: course.currency || 'TZS',
        order_reference: orderReference,
        payment_method: payment_method || 'mpesa',
        customer: {
          email: profile?.email,
          phone_number: customer_phone.replace(/^0/, '255'),
          name: profile?.full_name,
        },
        description: `Purchase: ${course.title}`,
        callback_url: `${baseUrl}/api/payments/webhook`,
        return_url: `${baseUrl}/courses?payment=success&order=${orderReference}`,
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
          amount: course.price,
          currency: course.currency || 'TZS',
        },
        clickpesa: {
          transaction_id: initiateResponse.data.transaction_id,
          checkout_url: initiateResponse.data.checkout_url,
        },
        message: 'Payment initiated. Please complete on your phone.',
      })
    } catch (clickpesaError) {
      console.error('ClickPesa error:', clickpesaError)
      await supabase
        .from('payments')
        .update({ payment_status: 'failed' })
        .eq('id', payment.id)

      return NextResponse.json(
        { error: 'Payment provider unavailable. Try again later.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Courses POST error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}