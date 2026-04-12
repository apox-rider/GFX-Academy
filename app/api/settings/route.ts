import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')

    if (error) {
      console.error('Failed to fetch settings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    // Convert array of settings objects to a single object
    const settingsObject = settings?.reduce((acc, setting) => {
      return {
        ...acc,
        [setting.key]: setting.value
      }
    }, {} as Record<string, any>) || {}

    return NextResponse.json({
      success: true,
      settings: settingsObject
    })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update each setting
    const updates = Object.keys(body).map(key => 
      supabase
        .from('settings')
        .upsert({ key, value: body[key] })
    )

    const results = await Promise.all(updates)

    // Check for errors
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      console.error('Failed to update settings:', errors)
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}