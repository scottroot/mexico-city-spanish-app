import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateTranslationQuestion } from '@/app/game/translation/openai-client';
import { getUser } from '@/utils/supabase/auth';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { customFocus, translationDirection, previousPhrases } = body;

    // Generate question using OpenAI, passing previous phrases to avoid repetition
    const result = await generateTranslationQuestion(
      customFocus,
      translationDirection || 'en_to_es',
      previousPhrases || []
    );

    // Generate UUID for the question - we'll use this instead of waiting for DB to generate it
    const questionId = crypto.randomUUID();

    // Save question to database (fire-and-forget - don't await)
    // If this fails, evaluate-answer will fail when it tries to look up the question, which is acceptable
    (async () => {
      try {
        const { error } = await supabase
          .from('translation_questions')
          .insert({
            id: questionId,
            user_id: user.id,
            phrase: result.phrase,
            translation_direction: translationDirection || 'en_to_es',
            custom_focus: customFocus || null,
          });
        if (error) {
          console.error('Error saving question (non-blocking):', error);
        }
      } catch (error) {
        console.error('Error saving question (non-blocking):', error);
      }
    })();

    // Return response immediately - don't block on database insert or token usage tracking
    const response = NextResponse.json({
      questionId,
      phrase: result.phrase,
    });

    // Save token usage asynchronously (non-blocking, fire-and-forget)
    // The function validates that user_id matches auth.uid() and bypasses RLS
    (async () => {
      try {
        await supabase.rpc('insert_token_usage', {
          p_user_id: user.id,
          p_question_id: questionId,
          p_prompt_tokens: result.tokenUsage.promptTokens,
          p_completion_tokens: result.tokenUsage.completionTokens,
          p_total_tokens: result.tokenUsage.totalTokens,
          p_model: 'gpt-4o-mini',
          p_purpose: 'generate_question',
        });
      } catch (error) {
        // Log error but don't block the response
        console.error('Error saving token usage (non-blocking):', error);
      }
    })();

    return response;
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate question' },
      { status: 500 }
    );
  }
}

