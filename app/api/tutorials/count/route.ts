import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { count, error } = await supabase
      .from('tutorials')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true)

    if (error) {
      console.error('Failed to count tutorials:', error)
      return NextResponse.json({ count: 0 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error('Tutorials count error:', error)
    return NextResponse.json({ count: 0 })
  }
}