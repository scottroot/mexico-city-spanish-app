import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { quizId } = await params;

    // Get quiz metadata (verify it belongs to the user)
    const { data: quiz, error } = await supabase
      .from('translation_quizzes')
      .select('id, custom_focus, translation_direction, questions_count, score, completed, created_at, study_guide, mistakes_count, quiz_history')
      .eq('id', quizId)
      .eq('user_id', user.id)
      .single();

    if (error || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error in GET /api/translation/quizzes/[quizId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { error: userError, ...user } = await getUser();
    if (userError || !user.isLoggedIn) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { quizId } = await params;
    const body = await request.json();

    // Update quiz (verify it belongs to the user)
    const { data: quiz, error } = await supabase
      .from('translation_quizzes')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quizId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error in PATCH /api/translation/quizzes/[quizId]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update quiz' },
      { status: 500 }
    );
  }
}

