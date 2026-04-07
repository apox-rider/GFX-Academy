import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const TIER_HIERARCHY: Record<string, number> = {
  free: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userTier = searchParams.get('tier') || 'free'
    const level = searchParams.get('level')
    const contentType = searchParams.get('type')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const userTierLevel = TIER_HIERARCHY[userTier] || 0

    let query = supabase
      .from('tutorials')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (level) {
      query = query.eq('level', level)
    }

    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    const { data: tutorials, error } = await query

    if (error) {
      console.error('Failed to fetch tutorials:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tutorials' },
        { status: 500 }
      )
    }

    const filteredTutorials = tutorials?.filter((tutorial) => {
      const tutorialTierLevel = TIER_HIERARCHY[tutorial.required_tier] || 0
      return tutorialTierLevel <= userTierLevel
    })

    return NextResponse.json({
      success: true,
      tutorials: filteredTutorials || [],
      user_tier: userTier,
    })
  } catch (error) {
    console.error('Tutorials fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      content_type,
      content_url,
      duration_minutes,
      pages_count,
      level = 'beginner',
      required_tier = 'bronze',
      order_index = 0,
    } = body

    if (!title || !content_type) {
      return NextResponse.json(
        { error: 'Title and content type are required' },
        { status: 400 }
      )
    }

    if (!['video', 'pdf', 'article'].includes(content_type)) {
      return NextResponse.json(
        { error: 'Content type must be video, pdf, or article' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: tutorial, error } = await supabase
      .from('tutorials')
      .insert({
        title,
        description,
        content_type,
        content_url,
        duration_minutes,
        pages_count,
        level,
        required_tier,
        order_index,
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create tutorial:', error)
      return NextResponse.json(
        { error: 'Failed to create tutorial' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      tutorial,
    })
  } catch (error) {
    console.error('Tutorial creation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tutorial_id,
      title,
      description,
      content_url,
      duration_minutes,
      level,
      required_tier,
      order_index,
      is_published,
    } = body

    if (!tutorial_id) {
      return NextResponse.json(
        { error: 'Tutorial ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (content_url !== undefined) updateData.content_url = content_url
    if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes
    if (level !== undefined) updateData.level = level
    if (required_tier !== undefined) updateData.required_tier = required_tier
    if (order_index !== undefined) updateData.order_index = order_index
    if (is_published !== undefined) updateData.is_published = is_published

    const { data: tutorial, error } = await supabase
      .from('tutorials')
      .update(updateData)
      .eq('id', tutorial_id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update tutorial:', error)
      return NextResponse.json(
        { error: 'Failed to update tutorial' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      tutorial,
    })
  } catch (error) {
    console.error('Tutorial update error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tutorialId = searchParams.get('id')

    if (!tutorialId) {
      return NextResponse.json(
        { error: 'Tutorial ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('tutorials')
      .delete()
      .eq('id', tutorialId)

    if (error) {
      console.error('Failed to delete tutorial:', error)
      return NextResponse.json(
        { error: 'Failed to delete tutorial' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Tutorial deleted successfully',
    })
  } catch (error) {
    console.error('Tutorial deletion error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
