import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Since we don't have a dedicated links table, we'll store links in tutorials table with content_type = 'article' 
    // or we could use the settings table, but for simplicity let's use tutorials with a specific category approach
    // Actually, let's create a simple approach: store links as tutorials with content_type = 'article' and use title/url
    
    const { data: links, error } = await supabase
      .from('tutorials')
      .select('*')
      .eq('content_type', 'article')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch links:', error)
      return NextResponse.json(
        { error: 'Failed to fetch links' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      links: links || []
    })
  } catch (error) {
    console.error('Links fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, url, description, category } = body

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: link, error } = await supabase
      .from('tutorials')
      .insert({
        title,
        description: description || '',
        content_type: 'article',
        content_url: url,
        // Using duration_minutes to store category for links
        duration_minutes: category ? 1 : 0, // Just a flag to distinguish
        level: 'beginner',
        required_tier: 'free',
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create link:', error)
      return NextResponse.json(
        { error: 'Failed to create link' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      link
    })
  } catch (error) {
    console.error('Link creation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, url, description, category } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (url !== undefined) updateData.content_url = url
    if (description !== undefined) updateData.description = description
    if (category !== undefined) {
      updateData.duration_minutes = category ? 1 : 0
    }

    const { data: link, error } = await supabase
      .from('tutorials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update link:', error)
      return NextResponse.json(
        { error: 'Failed to update link' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      link
    })
  } catch (error) {
    console.error('Link update error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('tutorials')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete link:', error)
      return NextResponse.json(
        { error: 'Failed to delete link' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Link deleted successfully'
    })
  } catch (error) {
    console.error('Link deletion error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}