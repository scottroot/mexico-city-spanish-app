import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/auth';

// GET - Get progress for a specific game
export async function GET(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
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
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching progress for game:', error)
      return NextResponse.json(
        { error: error.message, data: null },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || null });
  } catch (error) {
    console.error('Error in GET /api/progress/game/[gameId]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', data: null },
      { status: 500 }
    );
  }
}
