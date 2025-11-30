import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { evaluateTranslation } from '@/app/game/translation/openai-client';
import { getUser } from '@/utils/supabase/auth';

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  const timings: Record<string, number> = {};

  try {
    // Verify authentication
    const authStart = performance.now();
    const supabase = await createClient();
    const { error: userError, ...user } = await getUser();
    
    timings.auth = performance.now() - authStart;
    if (userError || !user.isLoggedIn) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const parseStart = performance.now();
    const body = await request.json();
    const { 
      questionId,
      userTranslation,
      translationDirection,
      gptPhraseToTranslate,
    } = body;
    timings.parseRequest = performance.now() - parseStart;

    console.log(`////\n\nevaluate-answer:\n${JSON.stringify({questionId, userTranslation, translationDirection, gptPhraseToTranslate}, null, 2)}\n////`);

    if (!questionId || !userTranslation || !gptPhraseToTranslate) {
      return NextResponse.json(
        { error: 'questionId, userTranslation, and gptPhraseToTranslate are required' },
        { status: 400 }
      );
    }

    // Evaluate answer using OpenAI
    const openaiStart = performance.now();
    const result = await evaluateTranslation(
      gptPhraseToTranslate,
      userTranslation,
      translationDirection || 'en_to_es',
    );
    timings.openaiEvaluation = performance.now() - openaiStart;

    // Return response immediately - don't block on token usage tracking
    const responseStart = performance.now();
    const response = NextResponse.json({
      isCorrect: result.isCorrect,
      feedback: result.feedback,
      correctAnswer: result.correctAnswer,
    });
    timings.responseCreation = performance.now() - responseStart;

    // Save token usage asynchronously (non-blocking, fire-and-forget)
    // The function validates that user_id matches auth.uid() and bypasses RLS
    const tokenUsageStart = performance.now();
    (async () => {
      try {
        const tokenStart = performance.now();
        await supabase.rpc('insert_token_usage', {
          p_user_id: user.id,
          p_question_id: questionId,
          p_prompt_tokens: result.tokenUsage.promptTokens,
          p_completion_tokens: result.tokenUsage.completionTokens,
          p_total_tokens: result.tokenUsage.totalTokens,
          p_model: 'gpt-4o-mini',
          p_purpose: 'evaluate_answer',
        });
        const tokenEnd = performance.now();
        console.log(`[Token Usage Insert] Completed in ${(tokenEnd - tokenStart).toFixed(2)}ms (non-blocking)`);
      } catch (error) {
        // Log error but don't block the response
        console.error('Error saving token usage (non-blocking):', error);
      }
    })();
    timings.tokenUsageInit = performance.now() - tokenUsageStart;

    // Calculate total time
    timings.total = performance.now() - startTime;

    // // Log all timings
    // console.log('\n[Evaluate Answer Performance]');
    // console.log(`  Auth: ${timings.auth.toFixed(2)}ms`);
    // console.log(`  Parse Request: ${timings.parseRequest.toFixed(2)}ms`);
    // console.log(`  OpenAI Evaluation: ${timings.openaiEvaluation.toFixed(2)}ms`);
    // console.log(`  Response Creation: ${timings.responseCreation.toFixed(2)}ms`);
    // console.log(`  Token Usage Init: ${timings.tokenUsageInit.toFixed(2)}ms`);
    // console.log(`  Total: ${timings.total.toFixed(2)}ms\n`);

    return response;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}

