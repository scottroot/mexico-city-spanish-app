import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    const { slug } = await context.params
    
    // Get story by slug
    const { data: story, error } = await supabase
      .from('stories')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Error fetching story:', error)
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }
    
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }
    
    return NextResponse.json({ story })
  } catch (error) {
    console.error('Story API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
