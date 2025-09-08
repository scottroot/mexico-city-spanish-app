import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const level = searchParams.get('level')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    
    // Build query
    let query = supabase
      .from('stories')
      .select('id, title, slug, level, reading_time, featured_image_url, audio_url, summary, summary_english, created_at')
      .order('created_at', { ascending: true })
    
    // Apply filters
    if (level) {
      query = query.eq('level', level);
    }
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    if (offset) {
      const offsetNum = parseInt(offset);
      const limitNum = parseInt(limit || "10");
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }
    
    const { data: stories, error } = await query
    
    if (error) {
      console.error('Error fetching stories:', error)
      return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
    }
    
    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Stories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
