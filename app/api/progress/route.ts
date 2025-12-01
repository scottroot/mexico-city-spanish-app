import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/auth';

// Helper method to determine game type from game ID
function getGameTypeFromId(gameId: string): 'grammar' | 'vocabulary' | 'pronunciation' | 'custom_quiz' | 'unknown' {
  if (gameId.includes('grammar')) return 'grammar'
  if (gameId.includes('vocab')) return 'vocabulary'
  if (gameId.includes('pronunciation')) return 'pronunciation'
  if (gameId === 'custom_quiz') return 'custom_quiz'
  return 'unknown'
}

// GET - Get all progress for current user
export async function GET() {
  try {
    console.log('GET /api/progress: Starting...')
    const supabase = await createClient();

    // Get current user
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      console.error('Error getting user:', userError)
      return NextResponse.json(
        { error: 'User not authenticated', data: [] },
        { status: 401 }
      );
    }

    console.log('GET /api/progress: Fetching progress for user:', user.id)
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    console.log('GET /api/progress: Database result:', { data: data?.length, error })

    if (error) {
      console.error('Error fetching progress:', error)
      // If table doesn't exist, return empty array instead of error
      if (error.code === 'PGRST116' || error.message.includes('relation "progress" does not exist')) {
        console.log('Progress table does not exist yet, returning empty array')
        return NextResponse.json({ data: [] });
      }
      return NextResponse.json(
        { error: error.message, data: [] },
        { status: 500 }
      );
    }

    console.log('GET /api/progress: Returning progress list:', data?.length, 'items')
    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error in GET /api/progress:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', data: [] },
      { status: 500 }
    );
  }
}

// POST - Create a new progress record
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      console.log('User not authenticated - progress will not be saved to database')
      // Return success but don't save to database for unauthenticated users
      return NextResponse.json({
        success: true,
        message: 'Progress not saved - user not authenticated'
      });
    }

    // Parse request body
    const progressData = await request.json();

    if (!progressData.game_id) {
      return NextResponse.json(
        { error: 'game_id is required' },
        { status: 400 }
      );
    }

    // Ensure user profile exists before saving progress
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.log('Profile does not exist, creating profile for user:', user.id)

      // Create profile with proper error handling
      const { data: newProfile, error: createProfileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email,
          name: user?.name || user.email?.split('@')[0] || 'User'
        }])
        .select()
        .single();

      if (createProfileError) {
        console.error('Error creating profile:', createProfileError)
        // If it's a duplicate key error, the profile might already exist
        if (createProfileError.code === '23505') {
          console.log('Profile already exists, continuing...')
        } else {
          return NextResponse.json(
            { error: `Failed to create user profile: ${createProfileError.message}` },
            { status: 500 }
          );
        }
      } else {
        console.log('Profile created successfully:', newProfile)
      }

      // Create user stats
      const { error: createStatsError } = await supabase
        .from('user_stats')
        .insert([{
          user_id: user.id
        }]);

      if (createStatsError) {
        console.error('Error creating user stats:', createStatsError)
        // Don't fail the progress save if stats creation fails
      } else {
        console.log('User stats created successfully')
      }
    }

    // Determine game type from game_id
    const gameType = getGameTypeFromId(progressData.game_id)

    // Prepare data for database (only include columns that exist)
    const dbData = {
      user_id: user.id,
      game_type: gameType,
      game_id: progressData.game_id,
      score: progressData.score || 0,
      completed: true, // Assume completed if we're saving progress
      time_spent: progressData.completion_time || 0,
      achievements: progressData.achievements || []
    };

    const { data, error } = await supabase
      .from('progress')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error creating progress:', error)
      // If table doesn't exist, just log and return success (no-op)
      if (error.message.includes('relation "progress" does not exist')) {
        console.log('Progress table does not exist yet, skipping save')
        return NextResponse.json({ success: true });
      }
      // If it's a foreign key constraint error, provide more specific feedback
      if (error.code === '23503') {
        console.error('Foreign key constraint error - user profile may not exist')
        return NextResponse.json(
          { error: 'User profile not found. Please try logging out and back in.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Progress created successfully:', data)
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in POST /api/progress:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
