import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/auth';

// GET - Get user statistics
export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      console.error('Error getting user:', userError)
      return NextResponse.json(
        { error: 'User not authenticated', data: null },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('user_progress_summary')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user stats:', error)
      return NextResponse.json(
        { error: error.message, data: null },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET /api/progress/stats:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', data: null },
      { status: 500 }
    );
  }
}
