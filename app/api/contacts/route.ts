import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendContactNotification, sendAutoReply } from '@/lib/email'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeRead = searchParams.get('include_read') === 'true'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!includeRead) {
      query = query.eq('is_read', false)
    }

    const { data: contacts, error } = await query

    if (error) {
      console.error('Failed to fetch contacts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch contacts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contacts: contacts || [],
    })
  } catch (error) {
    console.error('Contacts fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: contact, error } = await supabase
      .from('contacts')
      .insert({
        name,
        email,
        subject: subject || null,
        message,
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create contact:', error)
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      )
    }

    await Promise.all([
      sendContactNotification({ name, email, subject, message }),
      sendAutoReply(email, name),
    ]).catch(emailError => {
      console.error('Email notification error (non-blocking):', emailError)
    })

    return NextResponse.json({
      success: true,
      contact,
      message: 'Thank you for your message. We will get back to you soon.',
    })
  } catch (error) {
    console.error('Contact creation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { contact_id, is_read } = body

    if (!contact_id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const updateData: Record<string, unknown> = {}
    if (typeof is_read === 'boolean') {
      updateData.is_read = is_read
      if (is_read) {
        updateData.replied_at = new Date().toISOString()
      }
    }

    const { data: contact, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', contact_id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update contact:', error)
      return NextResponse.json(
        { error: 'Failed to update contact' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      contact,
    })
  } catch (error) {
    console.error('Contact update error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('id')

    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)

    if (error) {
      console.error('Failed to delete contact:', error)
      return NextResponse.json(
        { error: 'Failed to delete contact' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    })
  } catch (error) {
    console.error('Contact deletion error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
