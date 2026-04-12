import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: videos, error } = await supabase
      .from('tutorials')
      .select('*')
      .eq('content_type', 'video')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch videos:', error)
      return NextResponse.json(
        { error: 'Failed to fetch videos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      videos: videos || []
    })
  } catch (error) {
    console.error('Videos fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, url, description, duration } = body

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: video, error } = await supabase
      .from('tutorials')
      .insert({
        title,
        description,
        content_type: 'video',
        content_url: url,
        duration_minutes: duration ? parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1]) || 0 : null,
        level: 'beginner',
        required_tier: 'free',
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create video:', error)
      return NextResponse.json(
        { error: 'Failed to create video' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      video
    })
  } catch (error) {
    console.error('Video creation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, url, description, duration } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (url !== undefined) updateData.content_url = url
    if (description !== undefined) updateData.description = description
    if (duration !== undefined) {
      updateData.duration_minutes = duration ? parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1]) || 0 : null
    }

    const { data: video, error } = await supabase
      .from('tutorials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update video:', error)
      return NextResponse.json(
        { error: 'Failed to update video' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      video
    })
  } catch (error) {
    console.error('Video update error:', error)
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
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('tutorials')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete video:', error)
      return NextResponse.json(
        { error: 'Failed to delete video' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    })
  } catch (error) {
    console.error('Video deletion error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}